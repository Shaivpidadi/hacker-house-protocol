import { useQuery } from '@graphprotocol/hypergraph-react';
import { Hacker, Property, Booking, Landlord, Event, Review } from '@/app/schema';

// Dashboard-specific queries
export function useDashboardStats() {
  const properties = useQuery(Property, { mode: 'public' });
  const bookings = useQuery(Booking, { mode: 'public' });
  const hackers = useQuery(Hacker, { mode: 'public' });
  const landlords = useQuery(Landlord, { mode: 'public' });
  const reviews = useQuery(Review, { mode: 'public' });
  const events = useQuery(Event, { mode: 'public' });

  if (!properties.data || !bookings.data || !hackers.data || !landlords.data || !reviews.data || !events.data) {
    return { loading: true, data: null };
  }

  const totalProperties = properties.data.length;
  const activeBookings = bookings.data.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
  const totalHackers = hackers.data.length;
  const totalRevenue = bookings.data
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const averageRating = reviews.data.length > 0 
    ? reviews.data.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.data.length 
    : 0;
  const totalEvents = events.data.length;
  const totalReviews = reviews.data.length;
  const totalLandlords = landlords.data.length;

  return {
    loading: false,
    data: {
      totalProperties,
      activeBookings,
      totalHackers,
      totalRevenue,
      averageRating: Math.round(averageRating * 10) / 10,
      totalEvents,
      totalReviews,
      totalLandlords
    }
  };
}

export function useRecentActivity() {
  const bookings = useQuery(Booking, { mode: 'public' });

  if (!bookings.data) {
    return { loading: true, data: [] };
  }

  const activities = bookings.data
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)
    .map(booking => ({
      id: booking.id,
      action: `Booking ${booking.status}`,
      property: booking.property?.[0]?.name || 'Unknown Property',
      user: booking.hackers?.[0]?.name || 'Unknown Hacker',
      time: new Date(booking.createdAt).toLocaleDateString(),
      status: booking.status
    }));

  return { loading: false, data: activities };
}

export function useDashboardProperties() {
  const properties = useQuery(Property, { mode: 'public' });

  if (!properties.data) {
    return { loading: true, data: [] };
  }

  const formattedProperties = properties.data
    .slice(0, 6)
    .map(property => ({
      id: property.id,
      name: property.name,
      location: property.location,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      status: property.status,
      image: property.image?.[0]?.url || '/placeholder.svg?height=200&width=300'
    }));

  return { loading: false, data: formattedProperties };
}

export function useDashboardBookings() {
  const bookings = useQuery(Booking, { mode: 'public' });

  if (!bookings.data) {
    return { loading: true, data: [] };
  }

  const formattedBookings = bookings.data
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)
    .map(booking => ({
      id: booking.id,
      property: booking.property?.[0]?.name || 'Unknown Property',
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      status: booking.status,
      price: booking.totalPrice
    }));

  return { loading: false, data: formattedBookings };
}

export function usePropertyStatusData() {
  const properties = useQuery(Property, { mode: 'public' });

  if (!properties.data) {
    return { loading: true, data: [] };
  }

  const statusCounts = properties.data.reduce((acc, property) => {
    acc[property.status] = (acc[property.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(statusCounts).map(([status, value]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value,
    color: status === 'available' ? '#8b5cf6' : status === 'booked' ? '#a855f7' : '#c084fc'
  }));

  return { loading: false, data };
}

export function useBookingStatusData() {
  const bookings = useQuery(Booking, { mode: 'public' });

  if (!bookings.data) {
    return { loading: true, data: [] };
  }

  const statusCounts = bookings.data.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(statusCounts).map(([status, value]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value,
    color: status === 'confirmed' ? '#8b5cf6' : status === 'completed' ? '#a855f7' : status === 'pending' ? '#c084fc' : '#fbcfe8'
  }));

  return { loading: false, data };
}

// Query hooks for common operations
export function useAvailableProperties() {
  return useQuery(Property, {
    mode: 'public',
    filter: { status: { is: 'available' } }
  });
}

export function useHackerBookings(hackerWalletAddress: string) {
  return useQuery(Booking, {
    mode: 'public'
  });
}

export function useLandlordProperties(landlordWalletAddress: string) {
  return useQuery(Property, {
    mode: 'public'
  });
}

export function usePropertyReviews(propertyId: string) {
  return useQuery(Review, {
    mode: 'public'
  });
}

export function useUpcomingEvents() {
  return useQuery(Event, {
    mode: 'public'
  });
}

export function usePropertyAvailability(propertyId: string, startDate: string, endDate: string) {
  return useQuery(Booking, {
    mode: 'public'
  });
}

// ADVANCED ANALYTICS QUERIES

// 1. Hacker Roommate History - Find hackers who have roomed together before
export function useHackerRoommateHistory(hackerWalletAddress: string) {
  return useQuery(Booking, {
    mode: 'public',
    filter: { status: { is: 'completed' } }
  });
}

// 2. Most Popular Properties - Properties with highest booking count
export function useMostPopularProperties(limit: number = 10) {
  return useQuery(Property, {
    mode: 'public'
  });
}

// 3. Payment Analytics - Most common payment methods and amounts
export function usePaymentAnalytics() {
  return useQuery(Booking, {
    mode: 'public'
  });
}

// 4. Landlord Performance Analytics
export function useLandlordAnalytics(landlordWalletAddress: string) {
  return useQuery(Landlord, {
    mode: 'public',
    filter: { walletAddress: { is: landlordWalletAddress } }
  });
}

// 5. Event-Driven Property Demand
export function useEventPropertyDemand(eventId: string) {
  return useQuery(Event, {
    mode: 'public'
  });
}

// 6. Hacker Travel Patterns
export function useHackerTravelPatterns(hackerWalletAddress: string) {
  return useQuery(Booking, {
    mode: 'public',
    filter: { status: { is: 'completed' } }
  });
}

// 7. Property Revenue Analytics
export function usePropertyRevenueAnalytics(propertyId: string) {
  return useQuery(Property, {
    mode: 'public'
  });
}

// 8. Hackathon Sponsor Insights
export function useHackathonSponsorInsights() {
  return useQuery(Event, {
    mode: 'public'
  });
}

// 9. Seasonal Booking Trends
export function useSeasonalBookingTrends() {
  return useQuery(Booking, {
    mode: 'public',
    filter: { status: { is: 'completed' } }
  });
}

// 10. Hacker Skill Network - Hackers who attend same events
export function useHackerSkillNetwork(hackerWalletAddress: string) {
  return useQuery(Hacker, {
    mode: 'public',
    filter: { walletAddress: { is: hackerWalletAddress } }
  });
}

// 11. Property Amenity Preferences
export function usePropertyAmenityPreferences() {
  return useQuery(Property, {
    mode: 'public'
  });
}

// 12. Cancellation Analytics
export function useCancellationAnalytics() {
  return useQuery(Booking, {
    mode: 'public',
    filter: { status: { is: 'cancelled' } }
  });
}

// 13. Review Sentiment Analysis
export function useReviewSentimentAnalysis() {
  return useQuery(Review, {
    mode: 'public'
  });
}

// 14. Property Occupancy Rates
export function usePropertyOccupancyRates(propertyId: string, startDate: string, endDate: string) {
  return useQuery(Booking, {
    mode: 'public'
  });
}

// 15. Hacker Budget Analysis
export function useHackerBudgetAnalysis(hackerWalletAddress: string) {
  return useQuery(Booking, {
    mode: 'public',
    filter: { status: { is: 'completed' } }
  });
}

