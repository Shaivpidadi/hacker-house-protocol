import {
  CoPayersSet as CoPayersSetEvent,
  EIP712DomainChanged as EIP712DomainChangedEvent,
  FundsWithdrawn as FundsWithdrawnEvent,
  GuestAdded as GuestAddedEvent,
  ListingCreatedBasic as ListingCreatedBasicEvent,
  ListingMetadataURISet as ListingMetadataURISetEvent,
  ListingPrivateDataSet as ListingPrivateDataSetEvent,
  ListingRequireProofUpdated as ListingRequireProofUpdatedEvent,
  ListingUpdatedBasic as ListingUpdatedBasicEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  ProtocolFeeUpdated as ProtocolFeeUpdatedEvent,
  ReservationCreated as ReservationCreatedEvent,
  ReservationFunded as ReservationFundedEvent,
  TreasuryUpdated as TreasuryUpdatedEvent,
  VerifierUpdated as VerifierUpdatedEvent
} from "../generated/HackerHouseProtocol/HackerHouseProtocol"
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
} from "../generated/schema"
import { Bytes } from "@graphprotocol/graph-ts"

export function handleCoPayersSet(event: CoPayersSetEvent): void {
  let entity = new CoPayersSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reservationId = event.params.reservationId
  entity.payers = changetype<Bytes[]>(event.params.payers)
  entity.bps = event.params.bps

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEIP712DomainChanged(
  event: EIP712DomainChangedEvent
): void {
  let entity = new EIP712DomainChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFundsWithdrawn(event: FundsWithdrawnEvent): void {
  let entity = new FundsWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reservationId = event.params.reservationId
  entity.to = event.params.to
  entity.builderAmount = event.params.builderAmount
  entity.protocolFee = event.params.protocolFee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGuestAdded(event: GuestAddedEvent): void {
  let entity = new GuestAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reservationId = event.params.reservationId
  entity.addedBy = event.params.addedBy
  entity.guest = event.params.guest

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleListingCreatedBasic(
  event: ListingCreatedBasicEvent
): void {
  let entity = new ListingCreatedBasic(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingId = event.params.listingId
  entity.builder = event.params.builder
  entity.paymentToken = event.params.paymentToken
  entity.nameHash = event.params.nameHash
  entity.locationHash = event.params.locationHash
  entity.nightlyRate = event.params.nightlyRate
  entity.maxGuests = event.params.maxGuests
  entity.requireProof = event.params.requireProof

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleListingMetadataURISet(
  event: ListingMetadataURISetEvent
): void {
  let entity = new ListingMetadataURISet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingId = event.params.listingId
  entity.metadataURI = event.params.metadataURI

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleListingPrivateDataSet(
  event: ListingPrivateDataSetEvent
): void {
  let entity = new ListingPrivateDataSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingId = event.params.listingId
  entity.privDataHash = event.params.privDataHash
  entity.encPrivDataCid = event.params.encPrivDataCid

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleListingRequireProofUpdated(
  event: ListingRequireProofUpdatedEvent
): void {
  let entity = new ListingRequireProofUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingId = event.params.listingId
  entity.requireProof = event.params.requireProof

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleListingUpdatedBasic(
  event: ListingUpdatedBasicEvent
): void {
  let entity = new ListingUpdatedBasic(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingId = event.params.listingId
  entity.builder = event.params.builder
  entity.paymentToken = event.params.paymentToken
  entity.nameHash = event.params.nameHash
  entity.locationHash = event.params.locationHash
  entity.nightlyRate = event.params.nightlyRate
  entity.maxGuests = event.params.maxGuests
  entity.active = event.params.active

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProtocolFeeUpdated(event: ProtocolFeeUpdatedEvent): void {
  let entity = new ProtocolFeeUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.feeBps = event.params.feeBps

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReservationCreated(event: ReservationCreatedEvent): void {
  let entity = new ReservationCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reservationId = event.params.reservationId
  entity.listingId = event.params.listingId
  entity.renter = event.params.renter
  entity.startDate = event.params.startDate
  entity.endDate = event.params.endDate
  entity.totalDue = event.params.totalDue

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReservationFunded(event: ReservationFundedEvent): void {
  let entity = new ReservationFunded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reservationId = event.params.reservationId
  entity.payer = event.params.payer
  entity.amount = event.params.amount
  entity.newTotalPaid = event.params.newTotalPaid
  entity.activated = event.params.activated

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTreasuryUpdated(event: TreasuryUpdatedEvent): void {
  let entity = new TreasuryUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.treasury = event.params.treasury

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVerifierUpdated(event: VerifierUpdatedEvent): void {
  let entity = new VerifierUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.verifier = event.params.verifier

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
