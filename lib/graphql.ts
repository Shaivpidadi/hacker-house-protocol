import { gql } from 'graphql-request';

// HHP Protocol Subgraph Configuration
export const HHP_SUBGRAPH_URL = process.env.NEXT_PUBLIC_HHP_SUBGRAPH_URL ||
  'https://api.studio.thegraph.com/query/118830/hacker-house-protocol/version/latest';

export const HHP_SUBGRAPH_HEADERS = {
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_HHP_SUBGRAPH_API_KEY || ''}`,
};

// Common GraphQL Queries
export const LISTINGS_QUERY = gql`
  query GetListings($first: Int = 100, $skip: Int = 0, $where: ListingCreatedBasic_filter) {
    listingCreatedBasics(
      first: $first
      skip: $skip
      orderBy: blockTimestamp
      orderDirection: desc
      where: $where
    ) {
      id
      listingId
      builder
      paymentToken
      nameHash
      locationHash
      nightlyRate
      maxGuests
      requireProof
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export const RESERVATIONS_QUERY = gql`
  query GetReservations($first: Int = 100, $skip: Int = 0, $where: ReservationCreated_filter) {
    reservationCreateds(
      first: $first
      skip: $skip
      orderBy: blockTimestamp
      orderDirection: desc
      where: $where
    ) {
      id
      listingId
      renter
      startDate
      endDate
      nights
      payers
      bps
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export const RESERVATION_FUNDING_QUERY = gql`
  query GetReservationFunding($first: Int = 100, $skip: Int = 0, $where: ReservationFunded_filter) {
    reservationFundeds(
      first: $first
      skip: $skip
      orderBy: blockTimestamp
      orderDirection: desc
      where: $where
    ) {
      id
      reservationId
      payer
      amount
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export const GUEST_ADDED_QUERY = gql`
  query GetGuestsAdded($first: Int = 100, $skip: Int = 0, $where: GuestAdded_filter) {
    guestAddeds(
      first: $first
      skip: $skip
      orderBy: blockTimestamp
      orderDirection: desc
      where: $where
    ) {
      id
      reservationId
      guest
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export const FUNDS_WITHDRAWN_QUERY = gql`
  query GetFundsWithdrawn($first: Int = 100, $skip: Int = 0, $where: FundsWithdrawn_filter) {
    fundsWithdrawns(
      first: $first
      skip: $skip
      orderBy: blockTimestamp
      orderDirection: desc
      where: $where
    ) {
      id
      reservationId
      to
      amount
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export const CO_PAYERS_QUERY = gql`
  query GetCoPayers($first: Int = 100, $skip: Int = 0, $where: CoPayersSet_filter) {
    coPayersSets(
      first: $first
      skip: $skip
      orderBy: blockTimestamp
      orderDirection: desc
      where: $where
    ) {
      id
      reservationId
      payers
      bps
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// Combined queries for better performance
export const LISTING_WITH_RESERVATIONS_QUERY = gql`
  query GetListingWithReservations($listingId: String!, $first: Int = 100) {
    listingCreatedBasic(id: $listingId) {
      id
      builder
      name
      location
      metadataURI
      paymentToken
      nightlyRate
      maxGuests
      active
      privDataHash
      encPrivDataCid
      requireProof
      blockNumber
      blockTimestamp
      transactionHash
    }
    reservationCreateds(
      first: $first
      where: { listingId: $listingId }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      listingId
      renter
      startDate
      endDate
      nights
      payers
      bps
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export const RESERVATION_DETAILS_QUERY = gql`
  query GetReservationDetails($reservationId: String!) {
    reservationCreated(id: $reservationId) {
      id
      listingId
      renter
      startDate
      endDate
      nights
      payers
      bps
      blockNumber
      blockTimestamp
      transactionHash
    }
    reservationFundeds(
      where: { reservationId: $reservationId }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      reservationId
      payer
      amount
      blockNumber
      blockTimestamp
      transactionHash
    }
    guestAddeds(
      where: { reservationId: $reservationId }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      reservationId
      guest
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// Dashboard summary query
export const DASHBOARD_SUMMARY_QUERY = gql`
  query GetDashboardSummary {
    listingCreatedBasics(
      first: 5
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      listingId
      builder
      nameHash
      locationHash
      nightlyRate
      maxGuests
      requireProof
      blockTimestamp
    }
    reservationCreateds(
      first: 5
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      reservationId
      listingId
      renter
      startDate
      endDate
      totalDue
      blockTimestamp
    }
    reservationFundeds(
      first: 5
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      reservationId
      amount
      blockTimestamp
    }
  }
`;

// Enhanced listings query with metadata and private data
export const ENHANCED_LISTINGS_QUERY = gql`
  query GetEnhancedListings($first: Int = 100, $skip: Int = 0, $where: ListingCreatedBasic_filter) {
    listingCreatedBasics(
      first: $first
      skip: $skip
      orderBy: blockTimestamp
      orderDirection: desc
      where: $where
    ) {
      id
      listingId
      builder
      paymentToken
      nameHash
      locationHash
      nightlyRate
      maxGuests
      requireProof
      blockNumber
      blockTimestamp
      transactionHash
    }
    listingMetadataURISets(
      first: $first
      skip: $skip
      orderBy: blockNumber
      orderDirection: desc
    ) {
      id
      listingId
      metadataURI
      blockNumber
      blockTimestamp
      transactionHash
    }
    listingPrivateDataSets(
      first: $first
      skip: $skip
      orderBy: blockNumber
      orderDirection: desc
    ) {
      id
      listingId
      privDataHash
      encPrivDataCid
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// Query for a single listing by listing ID
export const LISTING_BY_ID_QUERY = gql`
  query GetListingById($listingId: String!) {
    listingCreatedBasics(where: { listingId: $listingId }) {
      id
      listingId
      builder
      paymentToken
      nameHash
      locationHash
      nightlyRate
      maxGuests
      requireProof
      blockNumber
      blockTimestamp
      transactionHash
    }
    listingMetadataURISets(where: { listingId: $listingId }) {
      id
      listingId
      metadataURI
      blockNumber
      blockTimestamp
      transactionHash
    }
    listingPrivateDataSets(where: { listingId: $listingId }) {
      id
      listingId
      privDataHash
      encPrivDataCid
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;
