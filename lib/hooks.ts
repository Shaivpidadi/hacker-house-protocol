import { useQuery, useCreateEntity, useUpdateEntity, useDeleteEntity } from '@graphprotocol/hypergraph-react';
import { Hacker, Property, Booking, Landlord, Event, Review, Image, BookingPayment } from '@/app/schema';

// ===== PROPERTY HOOKS =====

export function useProperties(filters?: {
  status?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  wifi?: boolean;
}) {
  console.log('🔍 useProperties hook called with filters:', filters);
  
  const result = useQuery(Property, {
    mode: 'public', // Changed from 'private' to 'public'
    filter: filters ? {
      ...(filters.status && { status: { is: filters.status } }),
      ...(filters.location && { location: { contains: filters.location } }),
      ...(filters.minPrice && { price: { greaterThan: filters.minPrice - 1 } }),
      ...(filters.maxPrice && { price: { lessThan: filters.maxPrice + 1 } }),
      ...(filters.bedrooms && { bedrooms: { greaterThan: filters.bedrooms - 1 } }),
      ...(filters.wifi !== undefined && { wifi: { is: filters.wifi } })
    } : undefined
  });
  
  console.log('📊 useProperties result:', result);
  return result;
}

export function useCreateProperty() {
  return useCreateEntity(Property);
}

export function useUpdateProperty() {
  return useUpdateEntity(Property);
}

export function useDeleteProperty() {
  return useDeleteEntity({ space: 'public' }); // Changed from 'private'
}

// ===== BOOKING HOOKS =====

export function useBookings(filters?: {
  hackerWallet?: string;
  landlordWallet?: string;
  propertyId?: string;
  status?: string;
}) {
  return useQuery(Booking, {
    mode: 'public', // Changed from 'private' to 'public'
    filter: filters?.status ? { status: { is: filters.status } } : undefined
  });
}

export function useCreateBooking() {
  return useCreateEntity(Booking);
}

export function useUpdateBooking() {
  return useUpdateEntity(Booking);
}

export function useDeleteBooking() {
  return useDeleteEntity({ space: 'public' }); // Changed from 'private'
}

// ===== HACKER HOOKS =====

export function useHackers(filters?: {
  walletAddress?: string;
}) {
  return useQuery(Hacker, {
    mode: 'public', // Changed from 'private' to 'public'
    filter: filters?.walletAddress ? { walletAddress: { is: filters.walletAddress } } : undefined
  });
}

export function useCreateHacker() {
  return useCreateEntity(Hacker);
}

export function useUpdateHacker() {
  return useUpdateEntity(Hacker);
}

export function useDeleteHacker() {
  return useDeleteEntity({ space: 'public' }); // Changed from 'private'
}

// ===== LANDLORD HOOKS =====

export function useLandlords(filters?: {
  walletAddress?: string;
}) {
  return useQuery(Landlord, {
    mode: 'public', // Changed from 'private' to 'public'
    filter: filters?.walletAddress ? { walletAddress: { is: filters.walletAddress } } : undefined
  });
}

export function useCreateLandlord() {
  return useCreateEntity(Landlord);
}

export function useUpdateLandlord() {
  return useUpdateEntity(Landlord);
}

export function useDeleteLandlord() {
  return useDeleteEntity({ space: 'public' }); // Changed from 'private'
}

// ===== EVENT HOOKS =====

export function useEvents(filters?: {
  upcoming?: boolean;
  organizer?: string;
}) {
  return useQuery(Event, {
    mode: 'public', // Changed from 'private' to 'public'
    filter: filters?.organizer ? { organizer: { contains: filters.organizer } } : undefined
  });
}

export function useCreateEvent() {
  return useCreateEntity(Event);
}

export function useUpdateEvent() {
  return useUpdateEntity(Event);
}

export function useDeleteEvent() {
  return useDeleteEntity({ space: 'public' }); // Changed from 'private'
}

// ===== REVIEW HOOKS =====

export function useReviews(filters?: {
  propertyId?: string;
  hackerWallet?: string;
}) {
  return useQuery(Review, {
    mode: 'public' // Changed from 'private' to 'public'
  });
}

export function useCreateReview() {
  return useCreateEntity(Review);
}

export function useUpdateReview() {
  return useUpdateEntity(Review);
}

export function useDeleteReview() {
  return useDeleteEntity({ space: 'public' }); // Changed from 'private'
}

// ===== IMAGE HOOKS =====

export function useCreateImage() {
  return useCreateEntity(Image);
}

// ===== ANALYTICS HOOKS =====

export function usePopularProperties() {
  return useQuery(Property, { mode: 'public' });
}

export function usePaymentAnalytics() {
  return useQuery(BookingPayment, { mode: 'public' });
}

export function useOccupancyRates() {
  return useQuery(Booking, {
    mode: 'public',
    filter: { status: { is: 'completed' } }
  });
}

export function useSeasonalTrends() {
  return useQuery(Booking, {
    mode: 'public',
    filter: { status: { is: 'completed' } }
  });
}

export function useHackerTravelPatterns(hackerWallet: string) {
  return useQuery(Booking, {
    mode: 'public',
    filter: { status: { is: 'completed' } }
  });
}

export function useLandlordPerformance(landlordWallet: string) {
  return useQuery(Landlord, {
    mode: 'public',
    filter: { walletAddress: { is: landlordWallet } }
  });
}

// ===== UTILITY HOOKS =====

export function usePropertyAvailability(propertyId: string, startDate: string, endDate: string) {
  return useQuery(Booking, {
    mode: 'public'
  });
}

export function useHackerRoommateHistory(hackerWalletAddress: string) {
  return useQuery(Booking, {
    mode: 'public',
    filter: { status: { is: 'completed' } }
  });
}
