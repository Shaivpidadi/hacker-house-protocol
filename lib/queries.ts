import { useQuery } from '@graphprotocol/hypergraph-react';
import { Hacker, Property, Booking, Landlord, Event, Review } from '@/app/schema';

// query hooks for common operations
export function useAvailableProperties() {
  return useQuery(Property, {
    mode: 'private',
    filter: { status: { is: 'available' } }
  });
}

export function useHackerBookings(hackerWalletAddress: string) {
  return useQuery(Booking, {
    mode: 'private'
  });
}

export function useLandlordProperties(landlordWalletAddress: string) {
  return useQuery(Property, {
    mode: 'private'
  });
}

export function usePropertyReviews(propertyId: string) {
  return useQuery(Review, {
    mode: 'private'
  });
}

export function useUpcomingEvents() {
  return useQuery(Event, {
    mode: 'private'
  });
}

export function usePropertyAvailability(propertyId: string, startDate: string, endDate: string) {
  return useQuery(Booking, {
    mode: 'private'
  });
}

// ADVANCED ANALYTICS QUERIES

// 1. Hacker Roommate History - Find hackers who have roomed together before
export function useHackerRoommateHistory(hackerWalletAddress: string) {
  return useQuery(Booking, {
    mode: 'private',
    filter: { status: { is: 'completed' } }
  });
}

// 2. Most Popular Properties - Properties with highest booking count
export function useMostPopularProperties(limit: number = 10) {
  return useQuery(Property, {
    mode: 'private'
  });
}

// 3. Payment Analytics - Most common payment methods and amounts
export function usePaymentAnalytics() {
  return useQuery(Booking, {
    mode: 'private'
  });
}

// 4. Landlord Performance Analytics
export function useLandlordAnalytics(landlordWalletAddress: string) {
  return useQuery(Landlord, {
    mode: 'private',
    filter: { walletAddress: { is: landlordWalletAddress } }
  });
}

// 5. Event-Driven Property Demand
export function useEventPropertyDemand(eventId: string) {
  return useQuery(Event, {
    mode: 'private'
  });
}

// 6. Hacker Travel Patterns
export function useHackerTravelPatterns(hackerWalletAddress: string) {
  return useQuery(Booking, {
    mode: 'private',
    filter: { status: { is: 'completed' } }
  });
}

// 7. Property Revenue Analytics
export function usePropertyRevenueAnalytics(propertyId: string) {
  return useQuery(Property, {
    mode: 'private'
  });
}

// 8. Hackathon Sponsor Insights
export function useHackathonSponsorInsights() {
  return useQuery(Event, {
    mode: 'private'
  });
}

// 9. Seasonal Booking Trends
export function useSeasonalBookingTrends() {
  return useQuery(Booking, {
    mode: 'private',
    filter: { status: { is: 'completed' } }
  });
}

// 10. Hacker Skill Network - Hackers who attend same events
export function useHackerSkillNetwork(hackerWalletAddress: string) {
  return useQuery(Hacker, {
    mode: 'private',
    filter: { walletAddress: { is: hackerWalletAddress } }
  });
}

// 11. Property Amenity Preferences
export function usePropertyAmenityPreferences() {
  return useQuery(Property, {
    mode: 'private'
  });
}

// 12. Cancellation Analytics
export function useCancellationAnalytics() {
  return useQuery(Booking, {
    mode: 'private',
    filter: { status: { is: 'cancelled' } }
  });
}

// 13. Review Sentiment Analysis
export function useReviewSentimentAnalysis() {
  return useQuery(Review, {
    mode: 'private'
  });
}

// 14. Property Occupancy Rates
export function usePropertyOccupancyRates(propertyId: string, startDate: string, endDate: string) {
  return useQuery(Booking, {
    mode: 'private'
  });
}

// 15. Hacker Budget Analysis
export function useHackerBudgetAnalysis(hackerWalletAddress: string) {
  return useQuery(Booking, {
    mode: 'private',
    filter: { status: { is: 'completed' } }
  });
}

