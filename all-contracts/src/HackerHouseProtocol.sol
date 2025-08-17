// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// OpenZeppelin v5 imports
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

/**
 * HackerHouseProtocol (Arbitrum)
 *
 * - Listings posted by builders
 * - Reservations with co-pay splits (bps) + guest list
 * - Private data off-chain (encrypted); on-chain only hash+CID
 * - EIP-712 attestation gating: backend verifies POAP on Gnosis (The Graph), then signs eligibility
 * - Graph-friendly events (split to avoid stack-too-deep)
 */
contract HackerHouseProtocol is Ownable, ReentrancyGuard, EIP712 {
    using SafeERC20 for IERC20;

    // ======= Config =======
    address public treasury;        // protocol fee sink
    uint96  public protocolFeeBps;  // e.g., 200 = 2%
    address public verifier;        // backend signer for EIP-712 eligibility

    event TreasuryUpdated(address indexed treasury);
    event ProtocolFeeUpdated(uint96 feeBps);
    event VerifierUpdated(address indexed verifier);

    // ======= Storage =======
    struct Listing {
        address builder;            // lister wallet
        string  name;               // display
        string  location;           // human-readable
        string  metadataURI;        // IPFS/Arweave JSON: photos, amenities, abilities, etc.
        address paymentToken;       // ERC-20 on Arbitrum
        uint256 nightlyRate;        // token units (respect token decimals off-chain)
        uint8   maxGuests;
        bool    active;

        // Private (off-chain) data commit
        bytes32 privDataHash;       // keccak256(plaintextPrivateJson)
        string  encPrivDataCid;     // ipfs://... (AES-GCM ciphertext)

        // Gating: require EIP-712 eligibility proof at reservation creation
        bool    requireProof;
    }

    struct Reservation {
        uint256 listingId;
        address renter;             // primary renter (requester)
        uint64  startDate;          // unix seconds
        uint64  endDate;            // unix seconds
        uint256 totalDue;           // total price in paymentToken units
        uint256 amountPaid;         // cumulative paid to contract
        bool    active;             // true once fully funded
    }

    struct CreateResArgs {
        uint256 listingId;
        uint64  startDate;
        uint64  endDate;
        uint256 nights;
        address[] payers;
        uint16[]  bps;
    }

    struct EligibilityProof {
        uint256 expiry;
        uint256 nonce;
        bytes   sig;
    }

    uint256 public nextListingId;
    uint256 public nextReservationId;

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Reservation) public reservations;

    // co-payer splits per reservation
    mapping(uint256 => address[]) private _resPayers;  // reservationId => payers
    mapping(uint256 => uint16[])  private _resBps;     // reservationId => basis points (sum=10000)

    // guest list per reservation
    mapping(uint256 => address[]) private _resGuests;

    // EIP-712 replay guard: digest => used
    mapping(bytes32 => bool) public usedProof;

    // ======= Events (string-heavy parts split to avoid stack-too-deep) =======

    // No strings here (safer for stack)
    event ListingCreatedBasic(
        uint256 indexed listingId,
        address indexed builder,
        address indexed paymentToken,
        bytes32 nameHash,
        bytes32 locationHash,
        uint256 nightlyRate,
        uint8   maxGuests,
        bool    requireProof
    );

    event ListingUpdatedBasic(
        uint256 indexed listingId,
        address indexed builder,
        address indexed paymentToken,
        bytes32 nameHash,
        bytes32 locationHash,
        uint256 nightlyRate,
        uint8   maxGuests,
        bool    active
    );

    // Strings isolated in tiny events (no stack pressure)
    event ListingMetadataURISet(uint256 indexed listingId, string metadataURI);
    event ListingPrivateDataSet(uint256 indexed listingId, bytes32 privDataHash, string encPrivDataCid);
    event ListingRequireProofUpdated(uint256 indexed listingId, bool requireProof);

    event ReservationCreated(
        uint256 indexed reservationId,
        uint256 indexed listingId,
        address indexed renter,
        uint64  startDate,
        uint64  endDate,
        uint256 totalDue
    );

    event CoPayersSet(uint256 indexed reservationId, address[] payers, uint16[] bps);

    event ReservationFunded(
        uint256 indexed reservationId,
        address indexed payer,
        uint256 amount,
        uint256 newTotalPaid,
        bool    activated
    );

    event GuestAdded(uint256 indexed reservationId, address indexed addedBy, address indexed guest);

    event FundsWithdrawn(
        uint256 indexed reservationId,
        address indexed to,
        uint256 builderAmount,
        uint256 protocolFee
    );

    // ======= EIP-712 (eligibility attestation) =======
    // Eligibility(user, listingId, expiry, nonce)
    bytes32 private constant ELIG_TYPEHASH =
        keccak256("Eligibility(address user,uint256 listingId,uint256 expiry,uint256 nonce)");

    constructor(address _treasury)
        EIP712("HackerHouseProtocol", "1")
        Ownable(msg.sender)
    {
        require(_treasury != address(0), "treasury=0");
        treasury = _treasury;
        emit TreasuryUpdated(_treasury);
    }

    // ======= Admin =======
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "treasury=0");
        treasury = _treasury;
        emit TreasuryUpdated(_treasury);
    }

    function setProtocolFeeBps(uint96 _bps) external onlyOwner {
        require(_bps <= 1000, "fee too high"); // cap 10%
        protocolFeeBps = _bps;
        emit ProtocolFeeUpdated(_bps);
    }

    function setVerifier(address v) external onlyOwner {
        require(v != address(0), "verifier=0");
        verifier = v;
        emit VerifierUpdated(v);
    }

    // ======= Listings =======

    function createListing(
        string calldata name,
        string calldata location,
        string calldata metadataURI,
        address paymentToken,
        uint256 nightlyRate,
        uint8   maxGuests,
        bytes32 privDataHash,
        string calldata encPrivDataCid,
        bool    requireProof
    ) external returns (uint256 id) {
        require(paymentToken != address(0), "token=0");
        require(nightlyRate > 0, "rate=0");

        id = ++nextListingId;

        // piecewise assignment (avoid struct literal temp)
        Listing storage L = listings[id];
        L.builder        = msg.sender;
        L.name           = name;
        L.location       = location;
        L.metadataURI    = metadataURI;
        L.paymentToken   = paymentToken;
        L.nightlyRate    = nightlyRate;
        L.maxGuests      = maxGuests;
        L.active         = true;
        L.privDataHash   = privDataHash;
        L.encPrivDataCid = encPrivDataCid;
        L.requireProof   = requireProof;

        // precompute hashes (kept small for emit)
        bytes32 nameHash     = keccak256(bytes(name));
        bytes32 locationHash = keccak256(bytes(location));

        emit ListingCreatedBasic(
            id,
            msg.sender,
            paymentToken,
            nameHash,
            locationHash,
            nightlyRate,
            maxGuests,
            requireProof
        );
        emit ListingMetadataURISet(id, metadataURI);
        emit ListingPrivateDataSet(id, privDataHash, encPrivDataCid);
    }

    function updateListing(
        uint256 listingId,
        string calldata name,
        string calldata location,
        string calldata metadataURI,
        address paymentToken,
        uint256 nightlyRate,
        uint8   maxGuests,
        bool    active
    ) external {
        Listing storage L = listings[listingId];
        require(L.builder == msg.sender, "not builder");
        require(paymentToken != address(0), "token=0");
        require(nightlyRate > 0, "rate=0");

        L.name         = name;
        L.location     = location;
        L.metadataURI  = metadataURI;
        L.paymentToken = paymentToken;
        L.nightlyRate  = nightlyRate;
        L.maxGuests    = maxGuests;
        L.active       = active;

        emit ListingUpdatedBasic(
            listingId,
            L.builder,
            paymentToken,
            keccak256(bytes(name)),
            keccak256(bytes(location)),
            nightlyRate,
            maxGuests,
            active
        );
        emit ListingMetadataURISet(listingId, metadataURI);
    }

    function updateListingPrivateData(
        uint256 listingId,
        bytes32 privDataHash,
        string calldata encPrivDataCid
    ) external {
        Listing storage L = listings[listingId];
        require(L.builder == msg.sender, "not builder");
        L.privDataHash   = privDataHash;
        L.encPrivDataCid = encPrivDataCid;
        emit ListingPrivateDataSet(listingId, privDataHash, encPrivDataCid);
    }

    function updateListingRequireProof(uint256 listingId, bool requireProof) external {
        Listing storage L = listings[listingId];
        require(L.builder == msg.sender, "not builder");
        L.requireProof = requireProof;
        emit ListingRequireProofUpdated(listingId, requireProof);
    }

    // ======= EIP-712 Eligibility =======

    function _checkEligibility(
        address user,
        uint256 listingId,
        uint256 expiry,
        uint256 nonce,
        bytes calldata sig
    ) internal {
        require(verifier != address(0), "verifier not set");
        require(block.timestamp <= expiry, "proof expired");
        // Optional TTL cap (<= 10 minutes)
        require(expiry <= block.timestamp + 600, "ttl too long");

        bytes32 structHash = keccak256(abi.encode(
            ELIG_TYPEHASH, user, listingId, expiry, nonce
        ));
        bytes32 digest = _hashTypedDataV4(structHash);

        require(!usedProof[digest], "proof used");
        usedProof[digest] = true;

        address signer = ECDSA.recover(digest, sig);
        require(signer == verifier, "bad signature");
    }

    function _validateSplits(address[] calldata payers, uint16[] calldata bps) internal pure {
        uint256 len = bps.length;
        require(payers.length == len && len > 0, "bad splits");
        uint256 sum;
        unchecked { for (uint256 i; i < len; ++i) sum += bps[i]; }
        require(sum == 10_000, "bps!=100%");
    }

    function _emitReservationCreated(
        uint256 rid,
        uint256 listingId,
        address renter,
        uint64  startDate,
        uint64  endDate,
        uint256 totalDue
    ) internal {
        emit ReservationCreated(rid, listingId, renter, startDate, endDate, totalDue);
    }

    // ======= Reservations =======
    function createReservation(
        CreateResArgs calldata a,
        EligibilityProof calldata p
    ) external returns (uint256 rid) {
        Listing storage L = listings[a.listingId];
        require(L.active, "listing inactive");
        require(a.nights > 0, "nights=0");
        require(a.endDate > a.startDate, "bad dates");

        if (L.requireProof) {
            _checkEligibility(msg.sender, a.listingId, p.expiry, p.nonce, p.sig);
        }

        _validateSplits(a.payers, a.bps);

        rid = ++nextReservationId;

        Reservation storage R = reservations[rid];
        R.listingId = a.listingId;
        R.renter    = msg.sender;
        R.startDate = a.startDate;
        R.endDate   = a.endDate;

        uint256 totalDue_ = L.nightlyRate * a.nights;
        R.totalDue  = totalDue_;
        // amountPaid=0, active=false

        _resPayers[rid] = a.payers;
        _resBps[rid]    = a.bps;

        _emitReservationCreated(rid, a.listingId, msg.sender, a.startDate, a.endDate, totalDue_);
        emit CoPayersSet(rid, a.payers, a.bps);
    }

    /**
     * Any address can fund any amount toward a reservation. Once fully funded, it activates.
     */
    function fundReservation(uint256 reservationId, uint256 amount) external nonReentrant {
        Reservation storage R = reservations[reservationId];
        require(R.totalDue > 0, "bad reservation");
        require(amount > 0, "amount=0");
        require(!R.active, "already active");

        Listing storage L = listings[R.listingId];
        require(L.active, "listing inactive");

        IERC20(L.paymentToken).safeTransferFrom(msg.sender, address(this), amount);

        R.amountPaid += amount;
        bool activated = false;
        if (R.amountPaid >= R.totalDue) {
            R.active = true;
            activated = true;
        }

        emit ReservationFunded(reservationId, msg.sender, amount, R.amountPaid, activated);
    }

    /**
     * Renter or builder may add guests up to listing.maxGuests.
     */
    function addGuest(uint256 reservationId, address guest) external {
        require(guest != address(0), "guest=0");
        Reservation storage R = reservations[reservationId];
        Listing storage L = listings[R.listingId];
        require(msg.sender == R.renter || msg.sender == L.builder, "not authorized");

        require(_resGuests[reservationId].length < L.maxGuests, "max guests");
        _resGuests[reservationId].push(guest);

        emit GuestAdded(reservationId, msg.sender, guest);
    }

    /**
     * Builder withdraws funds. Protocol fee (if any) is taken.
     */
    function withdraw(uint256 reservationId, address to) external nonReentrant {
        require(to != address(0), "to=0");
        Reservation storage R = reservations[reservationId];
        Listing storage L = listings[R.listingId];
        require(msg.sender == L.builder, "not builder");
        require(R.active, "not active");
        require(R.amountPaid > 0, "nothing to withdraw");

        uint256 amount = R.amountPaid;
        R.amountPaid = 0; // pull-to-zero

        uint256 fee = (amount * protocolFeeBps) / 10_000;
        uint256 builderAmt = amount - fee;

        if (fee > 0) IERC20(L.paymentToken).safeTransfer(treasury, fee);
        IERC20(L.paymentToken).safeTransfer(to, builderAmt);

        emit FundsWithdrawn(reservationId, to, builderAmt, fee);
    }

    // ======= Views =======

    function getReservationPayers(uint256 reservationId) external view returns (address[] memory) {
        return _resPayers[reservationId];
    }

    function getReservationSplitsBps(uint256 reservationId) external view returns (uint16[] memory) {
        return _resBps[reservationId];
    }

    function getReservationGuests(uint256 reservationId) external view returns (address[] memory) {
        return _resGuests[reservationId];
    }
}
