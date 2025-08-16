export const HHP_ABI = [
    // User actions
    "function createReservation((uint256 listingId,uint64 startDate,uint64 endDate,uint256 nights,address[] payers,uint16[] bps) a,(uint256 expiry,uint256 nonce,bytes sig) p) returns (uint256 rid)",
    "function fundReservation(uint256 reservationId,uint256 amount)",
    "function addGuest(uint256 reservationId,address guest)",
    "function withdraw(uint256 reservationId,address to)",

    // View functions
    "function getReservationPayers(uint256) view returns (address[])",
    "function getReservationSplitsBps(uint256) view returns (uint16[])",
    "function getReservationGuests(uint256) view returns (address[])",
    "function listings(uint256) view returns (address builder,string name,string location,string metadataURI,address paymentToken,uint256 nightlyRate,uint8 maxGuests,bool active,bytes32 privDataHash,string encPrivDataCid,bool requireProof)",
    "function reservations(uint256) view returns (uint256 listingId,address renter,uint64 startDate,uint64 endDate,uint256 totalDue,uint256 amountPaid,bool active)",

    // Events for better UX
    "event ReservationCreated(uint256 indexed reservationId,uint256 indexed listingId,address indexed renter,uint64 startDate,uint64 endDate,uint256 nights)",
    "event ReservationFunded(uint256 indexed reservationId,address indexed payer,uint256 amount)",
    "event GuestAdded(uint256 indexed reservationId,address indexed guest)",
    "event Withdrawal(uint256 indexed reservationId,address indexed to,uint256 amount)"
];
