import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  CoPayersSet,
  EIP712DomainChanged,
  FundsWithdrawn,
  GuestAdded,
  ListingCreatedBasic,
  ListingMetadataURISet,
  ListingPrivateDataSet,
  ListingRequireProofUpdated,
  ListingUpdatedBasic,
  OwnershipTransferred,
  ProtocolFeeUpdated,
  ReservationCreated,
  ReservationFunded,
  TreasuryUpdated,
  VerifierUpdated
} from "../generated/HackerHouseProtocol/HackerHouseProtocol"

export function createCoPayersSetEvent(
  reservationId: BigInt,
  payers: Array<Address>,
  bps: Array<i32>
): CoPayersSet {
  let coPayersSetEvent = changetype<CoPayersSet>(newMockEvent())

  coPayersSetEvent.parameters = new Array()

  coPayersSetEvent.parameters.push(
    new ethereum.EventParam(
      "reservationId",
      ethereum.Value.fromUnsignedBigInt(reservationId)
    )
  )
  coPayersSetEvent.parameters.push(
    new ethereum.EventParam("payers", ethereum.Value.fromAddressArray(payers))
  )
  coPayersSetEvent.parameters.push(
    new ethereum.EventParam("bps", ethereum.Value.fromI32Array(bps))
  )

  return coPayersSetEvent
}

export function createEIP712DomainChangedEvent(): EIP712DomainChanged {
  let eip712DomainChangedEvent = changetype<EIP712DomainChanged>(newMockEvent())

  eip712DomainChangedEvent.parameters = new Array()

  return eip712DomainChangedEvent
}

export function createFundsWithdrawnEvent(
  reservationId: BigInt,
  to: Address,
  builderAmount: BigInt,
  protocolFee: BigInt
): FundsWithdrawn {
  let fundsWithdrawnEvent = changetype<FundsWithdrawn>(newMockEvent())

  fundsWithdrawnEvent.parameters = new Array()

  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "reservationId",
      ethereum.Value.fromUnsignedBigInt(reservationId)
    )
  )
  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "builderAmount",
      ethereum.Value.fromUnsignedBigInt(builderAmount)
    )
  )
  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "protocolFee",
      ethereum.Value.fromUnsignedBigInt(protocolFee)
    )
  )

  return fundsWithdrawnEvent
}

export function createGuestAddedEvent(
  reservationId: BigInt,
  addedBy: Address,
  guest: Address
): GuestAdded {
  let guestAddedEvent = changetype<GuestAdded>(newMockEvent())

  guestAddedEvent.parameters = new Array()

  guestAddedEvent.parameters.push(
    new ethereum.EventParam(
      "reservationId",
      ethereum.Value.fromUnsignedBigInt(reservationId)
    )
  )
  guestAddedEvent.parameters.push(
    new ethereum.EventParam("addedBy", ethereum.Value.fromAddress(addedBy))
  )
  guestAddedEvent.parameters.push(
    new ethereum.EventParam("guest", ethereum.Value.fromAddress(guest))
  )

  return guestAddedEvent
}

export function createListingCreatedBasicEvent(
  listingId: BigInt,
  builder: Address,
  paymentToken: Address,
  nameHash: Bytes,
  locationHash: Bytes,
  nightlyRate: BigInt,
  maxGuests: i32,
  requireProof: boolean
): ListingCreatedBasic {
  let listingCreatedBasicEvent = changetype<ListingCreatedBasic>(newMockEvent())

  listingCreatedBasicEvent.parameters = new Array()

  listingCreatedBasicEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  listingCreatedBasicEvent.parameters.push(
    new ethereum.EventParam("builder", ethereum.Value.fromAddress(builder))
  )
  listingCreatedBasicEvent.parameters.push(
    new ethereum.EventParam(
      "paymentToken",
      ethereum.Value.fromAddress(paymentToken)
    )
  )
  listingCreatedBasicEvent.parameters.push(
    new ethereum.EventParam("nameHash", ethereum.Value.fromFixedBytes(nameHash))
  )
  listingCreatedBasicEvent.parameters.push(
    new ethereum.EventParam(
      "locationHash",
      ethereum.Value.fromFixedBytes(locationHash)
    )
  )
  listingCreatedBasicEvent.parameters.push(
    new ethereum.EventParam(
      "nightlyRate",
      ethereum.Value.fromUnsignedBigInt(nightlyRate)
    )
  )
  listingCreatedBasicEvent.parameters.push(
    new ethereum.EventParam(
      "maxGuests",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(maxGuests))
    )
  )
  listingCreatedBasicEvent.parameters.push(
    new ethereum.EventParam(
      "requireProof",
      ethereum.Value.fromBoolean(requireProof)
    )
  )

  return listingCreatedBasicEvent
}

export function createListingMetadataURISetEvent(
  listingId: BigInt,
  metadataURI: string
): ListingMetadataURISet {
  let listingMetadataUriSetEvent =
    changetype<ListingMetadataURISet>(newMockEvent())

  listingMetadataUriSetEvent.parameters = new Array()

  listingMetadataUriSetEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  listingMetadataUriSetEvent.parameters.push(
    new ethereum.EventParam(
      "metadataURI",
      ethereum.Value.fromString(metadataURI)
    )
  )

  return listingMetadataUriSetEvent
}

export function createListingPrivateDataSetEvent(
  listingId: BigInt,
  privDataHash: Bytes,
  encPrivDataCid: string
): ListingPrivateDataSet {
  let listingPrivateDataSetEvent =
    changetype<ListingPrivateDataSet>(newMockEvent())

  listingPrivateDataSetEvent.parameters = new Array()

  listingPrivateDataSetEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  listingPrivateDataSetEvent.parameters.push(
    new ethereum.EventParam(
      "privDataHash",
      ethereum.Value.fromFixedBytes(privDataHash)
    )
  )
  listingPrivateDataSetEvent.parameters.push(
    new ethereum.EventParam(
      "encPrivDataCid",
      ethereum.Value.fromString(encPrivDataCid)
    )
  )

  return listingPrivateDataSetEvent
}

export function createListingRequireProofUpdatedEvent(
  listingId: BigInt,
  requireProof: boolean
): ListingRequireProofUpdated {
  let listingRequireProofUpdatedEvent =
    changetype<ListingRequireProofUpdated>(newMockEvent())

  listingRequireProofUpdatedEvent.parameters = new Array()

  listingRequireProofUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  listingRequireProofUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "requireProof",
      ethereum.Value.fromBoolean(requireProof)
    )
  )

  return listingRequireProofUpdatedEvent
}

export function createListingUpdatedBasicEvent(
  listingId: BigInt,
  builder: Address,
  paymentToken: Address,
  nameHash: Bytes,
  locationHash: Bytes,
  nightlyRate: BigInt,
  maxGuests: i32,
  active: boolean
): ListingUpdatedBasic {
  let listingUpdatedBasicEvent = changetype<ListingUpdatedBasic>(newMockEvent())

  listingUpdatedBasicEvent.parameters = new Array()

  listingUpdatedBasicEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  listingUpdatedBasicEvent.parameters.push(
    new ethereum.EventParam("builder", ethereum.Value.fromAddress(builder))
  )
  listingUpdatedBasicEvent.parameters.push(
    new ethereum.EventParam(
      "paymentToken",
      ethereum.Value.fromAddress(paymentToken)
    )
  )
  listingUpdatedBasicEvent.parameters.push(
    new ethereum.EventParam("nameHash", ethereum.Value.fromFixedBytes(nameHash))
  )
  listingUpdatedBasicEvent.parameters.push(
    new ethereum.EventParam(
      "locationHash",
      ethereum.Value.fromFixedBytes(locationHash)
    )
  )
  listingUpdatedBasicEvent.parameters.push(
    new ethereum.EventParam(
      "nightlyRate",
      ethereum.Value.fromUnsignedBigInt(nightlyRate)
    )
  )
  listingUpdatedBasicEvent.parameters.push(
    new ethereum.EventParam(
      "maxGuests",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(maxGuests))
    )
  )
  listingUpdatedBasicEvent.parameters.push(
    new ethereum.EventParam("active", ethereum.Value.fromBoolean(active))
  )

  return listingUpdatedBasicEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createProtocolFeeUpdatedEvent(
  feeBps: BigInt
): ProtocolFeeUpdated {
  let protocolFeeUpdatedEvent = changetype<ProtocolFeeUpdated>(newMockEvent())

  protocolFeeUpdatedEvent.parameters = new Array()

  protocolFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("feeBps", ethereum.Value.fromUnsignedBigInt(feeBps))
  )

  return protocolFeeUpdatedEvent
}

export function createReservationCreatedEvent(
  reservationId: BigInt,
  listingId: BigInt,
  renter: Address,
  startDate: BigInt,
  endDate: BigInt,
  totalDue: BigInt
): ReservationCreated {
  let reservationCreatedEvent = changetype<ReservationCreated>(newMockEvent())

  reservationCreatedEvent.parameters = new Array()

  reservationCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "reservationId",
      ethereum.Value.fromUnsignedBigInt(reservationId)
    )
  )
  reservationCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  reservationCreatedEvent.parameters.push(
    new ethereum.EventParam("renter", ethereum.Value.fromAddress(renter))
  )
  reservationCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "startDate",
      ethereum.Value.fromUnsignedBigInt(startDate)
    )
  )
  reservationCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "endDate",
      ethereum.Value.fromUnsignedBigInt(endDate)
    )
  )
  reservationCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalDue",
      ethereum.Value.fromUnsignedBigInt(totalDue)
    )
  )

  return reservationCreatedEvent
}

export function createReservationFundedEvent(
  reservationId: BigInt,
  payer: Address,
  amount: BigInt,
  newTotalPaid: BigInt,
  activated: boolean
): ReservationFunded {
  let reservationFundedEvent = changetype<ReservationFunded>(newMockEvent())

  reservationFundedEvent.parameters = new Array()

  reservationFundedEvent.parameters.push(
    new ethereum.EventParam(
      "reservationId",
      ethereum.Value.fromUnsignedBigInt(reservationId)
    )
  )
  reservationFundedEvent.parameters.push(
    new ethereum.EventParam("payer", ethereum.Value.fromAddress(payer))
  )
  reservationFundedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  reservationFundedEvent.parameters.push(
    new ethereum.EventParam(
      "newTotalPaid",
      ethereum.Value.fromUnsignedBigInt(newTotalPaid)
    )
  )
  reservationFundedEvent.parameters.push(
    new ethereum.EventParam("activated", ethereum.Value.fromBoolean(activated))
  )

  return reservationFundedEvent
}

export function createTreasuryUpdatedEvent(treasury: Address): TreasuryUpdated {
  let treasuryUpdatedEvent = changetype<TreasuryUpdated>(newMockEvent())

  treasuryUpdatedEvent.parameters = new Array()

  treasuryUpdatedEvent.parameters.push(
    new ethereum.EventParam("treasury", ethereum.Value.fromAddress(treasury))
  )

  return treasuryUpdatedEvent
}

export function createVerifierUpdatedEvent(verifier: Address): VerifierUpdated {
  let verifierUpdatedEvent = changetype<VerifierUpdated>(newMockEvent())

  verifierUpdatedEvent.parameters = new Array()

  verifierUpdatedEvent.parameters.push(
    new ethereum.EventParam("verifier", ethereum.Value.fromAddress(verifier))
  )

  return verifierUpdatedEvent
}
