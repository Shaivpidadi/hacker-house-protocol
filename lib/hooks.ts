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
  return useQuery(Property, {
    mode: 'private',
    filter: filters ? {
      ...(filters.status && { status: { is: filters.status } }),
      ...(filters.location && { location: { contains: filters.location } }),
      ...(filters.minPrice && { price: { greaterThan: filters.minPrice - 1 } }),
      ...(filters.maxPrice && { price: { lessThan: filters.maxPrice + 1 } }),
      ...(filters.bedrooms && { bedrooms: { greaterThan: filters.bedrooms - 1 } }),
      ...(filters.wifi !== undefined && { wifi: { is: filters.wifi } })
    } : undefined
  });
}

export function useCreateProperty() {
  return useCreateEntity(Property);
}

export function useUpdateProperty() {
  return useUpdateEntity(Property);
}

export function useDeleteProperty() {
  return useDeleteEntity({ space: 'private' });
}

// ===== BOOKING HOOKS =====

export function useBookings(filters?: {
  hackerWallet?: string;
  landlordWallet?: string;
  propertyId?: string;
  status?: string;
}) {
  return useQuery(Booking, {
    mode: 'private',
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
  return useDeleteEntity({ space: 'private' });
}

// ===== HACKER HOOKS =====

export function useHackers(filters?: {
  walletAddress?: string;
}) {
  return useQuery(Hacker, {
    mode: 'private',
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
  return useDeleteEntity({ space: 'private' });
}

// ===== LANDLORD HOOKS =====

export function useLandlords(filters?: {
  walletAddress?: string;
}) {
  return useQuery(Landlord, {
    mode: 'private',
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
  return useDeleteEntity({ space: 'private' });
}

// ===== EVENT HOOKS =====

export function useEvents(filters?: {
  upcoming?: boolean;
  organizer?: string;
}) {
  return useQuery(Event, {
    mode: 'private',
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
  return useDeleteEntity({ space: 'private' });
}

// ===== REVIEW HOOKS =====

export function useReviews(filters?: {
  propertyId?: string;
  hackerWallet?: string;
}) {
  return useQuery(Review, {
    mode: 'private'
  });
}

export function useCreateReview() {
  return useCreateEntity(Review);
}

export function useUpdateReview() {
  return useUpdateEntity(Review);
}

export function useDeleteReview() {
  return useDeleteEntity({ space: 'private' });
}

// ===== IMAGE HOOKS =====

export function useCreateImage() {
  return useCreateEntity(Image);
}

// ===== ANALYTICS HOOKS =====

export function usePopularProperties() {
  return useQuery(Property, { mode: 'private' });
}

export function usePaymentAnalytics() {
  return useQuery(BookingPayment, { mode: 'private' });
}

export function useOccupancyRates() {
  return useQuery(Booking, {
    mode: 'private',
    filter: { status: { is: 'completed' } }
  });
}

export function useSeasonalTrends() {
  return useQuery(Booking, {
    mode: 'private',
    filter: { status: { is: 'completed' } }
  });
}

export function useHackerTravelPatterns(hackerWallet: string) {
  return useQuery(Booking, {
    mode: 'private',
    filter: { status: { is: 'completed' } }
  });
}

export function useLandlordPerformance(landlordWallet: string) {
  return useQuery(Landlord, {
    mode: 'private',
    filter: { walletAddress: { is: landlordWallet } }
  });
}

// ===== UTILITY HOOKS =====

export function usePropertyAvailability(propertyId: string, startDate: string, endDate: string) {
  return useQuery(Booking, {
    mode: 'private'
  });
}

export function useHackerRoommateHistory(hackerWalletAddress: string) {
  return useQuery(Booking, {
    mode: 'private',
    filter: { status: { is: 'completed' } }
  });
}
