import { GraphQLClient } from 'graphql-request';
import { HHP_SUBGRAPH_URL, HHP_SUBGRAPH_HEADERS } from './graphql';

// Create GraphQL client instance
export const graphqlClient = new GraphQLClient(HHP_SUBGRAPH_URL, {
  headers: HHP_SUBGRAPH_HEADERS,
});

// Utility function to make GraphQL requests
export async function fetchFromSubgraph<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  try {
    const data = await graphqlClient.request(query, variables);
    return data;
  } catch (error) {
    console.error('GraphQL request failed:', error);
    throw new Error(`GraphQL request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Type-safe wrapper for common operations
export const hhpClient = {
  // Fetch listings
  async getListings(params?: {
    first?: number;
    skip?: number;
    where?: any;
  }) {
    return fetchFromSubgraph(LISTINGS_QUERY, params);
  },

  // Fetch reservations
  async getReservations(params?: {
    first?: number;
    skip?: number;
    where?: any;
  }) {
    return fetchFromSubgraph(RESERVATIONS_QUERY, params);
  },

  // Fetch reservation funding
  async getReservationFunding(params?: {
    first?: number;
    skip?: number;
    where?: any;
  }) {
    return fetchFromSubgraph(RESERVATION_FUNDING_QUERY, params);
  },

  // Fetch guests added
  async getGuestsAdded(params?: {
    first?: number;
    skip?: number;
    where?: any;
  }) {
    return fetchFromSubgraph(GUEST_ADDED_QUERY, params);
  },

  // Fetch funds withdrawn
  async getFundsWithdrawn(params?: {
    first?: number;
    skip?: number;
    where?: any;
  }) {
    return fetchFromSubgraph(FUNDS_WITHDRAWN_QUERY, params);
  },

  // Fetch co-payers
  async getCoPayers(params?: {
    first?: number;
    skip?: number;
    where?: any;
  }) {
    return fetchFromSubgraph(CO_PAYERS_QUERY, params);
  },

  // Fetch listing with reservations
  async getListingWithReservations(listingId: string, first?: number) {
    return fetchFromSubgraph(LISTING_WITH_RESERVATIONS_QUERY, { listingId, first });
  },

  // Fetch reservation details
  async getReservationDetails(reservationId: string) {
    return fetchFromSubgraph(RESERVATION_DETAILS_QUERY, { reservationId });
  },

  // Fetch dashboard summary
  async getDashboardSummary() {
    return fetchFromSubgraph(DASHBOARD_SUMMARY_QUERY);
  },

  // Fetch enhanced listings with metadata and private data
  async getEnhancedListings(params?: {
    first?: number;
    skip?: number;
    where?: any;
  }) {
    return fetchFromSubgraph(ENHANCED_LISTINGS_QUERY, params);
  },
};

// Import the queries for use in components
import {
  LISTINGS_QUERY,
  RESERVATIONS_QUERY,
  RESERVATION_FUNDING_QUERY,
  GUEST_ADDED_QUERY,
  FUNDS_WITHDRAWN_QUERY,
  CO_PAYERS_QUERY,
  LISTING_WITH_RESERVATIONS_QUERY,
  RESERVATION_DETAILS_QUERY,
  DASHBOARD_SUMMARY_QUERY,
  ENHANCED_LISTINGS_QUERY,
} from './graphql';
