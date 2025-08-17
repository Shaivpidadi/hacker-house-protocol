// HHP Protocol Subgraph Types

export interface ListingCreatedBasic {
  id: string;
  listingId: string;
  builder: string;
  paymentToken: string;
  nameHash: string;
  locationHash: string;
  nightlyRate: string;
  maxGuests: number;
  requireProof: boolean;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
}

export interface ListingMetadataURISet {
  id: string;
  listingId: string;
  metadataURI: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
}

export interface ListingPrivateDataSet {
  id: string;
  listingId: string;
  privDataHash: string;
  encPrivDataCid: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
}

export interface ReservationCreated {
  id: string;
  reservationId: string;
  listingId: string;
  renter: string;
  startDate: number;
  endDate: number;
  totalDue: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
}

export interface ReservationFunded {
  id: string;
  reservationId: string;
  payer: string;
  amount: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
}

export interface GuestAdded {
  id: string;
  reservationId: string;
  guest: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
}

export interface FundsWithdrawn {
  id: string;
  reservationId: string;
  to: string;
  amount: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
}

export interface CoPayersSet {
  id: string;
  reservationId: string;
  payers: string[];
  bps: number[];
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
}

export interface EIP712DomainChanged {
  id: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
}

export interface ListingMetadataURISet {
  id: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
}

export interface ListingPrivateDataSet {
  id: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
}

export interface ListingRequireProofUpdated {
  id: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
}

export interface ListingUpdatedBasic {
  id: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
}

export interface OwnershipTransferred {
  id: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
}

export interface ProtocolFeeUpdated {
  id: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
}

export interface TreasuryUpdated {
  id: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
}

export interface VerifierUpdated {
  id: string;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
}

// GraphQL Response Types
export interface ListingsResponse {
  listingCreatedBasics: ListingCreatedBasic[];
}

export interface EnhancedListingsResponse {
  listingCreatedBasics: ListingCreatedBasic[];
  listingMetadataURISets: ListingMetadataURISet[];
  listingPrivateDataSets: ListingPrivateDataSet[];
}

export interface ReservationsResponse {
  reservationCreateds: ReservationCreated[];
}

export interface ReservationFundingResponse {
  reservationFundeds: ReservationFunded[];
}

export interface GuestsAddedResponse {
  guestAddeds: GuestAdded[];
}

export interface FundsWithdrawnResponse {
  fundsWithdrawns: FundsWithdrawn[];
}

export interface CoPayersResponse {
  coPayersSets: CoPayersSet[];
}

export interface ListingWithReservationsResponse {
  listingCreatedBasic: ListingCreatedBasic | null;
  reservationCreateds: ReservationCreated[];
}

export interface ReservationDetailsResponse {
  reservationCreated: ReservationCreated | null;
  reservationFundeds: ReservationFunded[];
  guestAddeds: GuestAdded[];
}

export interface DashboardSummaryResponse {
  listingCreatedBasics: ListingCreatedBasic[];
  reservationCreateds: ReservationCreated[];
  reservationFundeds: ReservationFunded[];
}

// Enhanced types for UI components
export interface EnhancedListing extends ListingCreatedBasic {
  totalReservations?: number;
  totalRevenue?: string;
  averageRating?: number;
}

export interface EnhancedReservation extends ReservationCreated {
  listing?: ListingCreatedBasic;
  totalFunded?: string;
  guests?: string[];
  isFullyFunded?: boolean;
  isActive?: boolean;
}

export interface EnhancedReservationFunding extends ReservationFunded {
  reservation?: ReservationCreated;
  listing?: ListingCreatedBasic;
}

// Filter types
export interface ListingFilter {
  builder?: string;
  active?: boolean;
  requireProof?: boolean;
  maxGuests_gte?: number;
  maxGuests_lte?: number;
  nightlyRate_gte?: string;
  nightlyRate_lte?: string;
}

export interface ReservationFilter {
  listingId?: string;
  renter?: string;
  startDate_gte?: number;
  startDate_lte?: number;
  endDate_gte?: number;
  endDate_lte?: number;
}

// Pagination types
export interface PaginationParams {
  first?: number;
  skip?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// Query result types
export interface QueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Utility types
export type Address = string;
export type Wei = string;
export type Timestamp = number;
export type BlockNumber = number;
export type TransactionHash = string;
