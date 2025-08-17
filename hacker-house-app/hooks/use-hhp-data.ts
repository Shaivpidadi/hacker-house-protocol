'use client';

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hhpClient } from '@/lib/graphql-client';
import type {
    ListingCreatedBasic,
    ReservationCreated,
    ReservationFunded,
    GuestAdded,
    FundsWithdrawn,
    CoPayersSet,
    ListingWithReservationsResponse,
    ReservationDetailsResponse,
    DashboardSummaryResponse,
    ListingFilter,
    ReservationFilter,
    PaginationParams,
} from '@/lib/types';

// Query keys for React Query
export const hhpQueryKeys = {
    all: ['hhp'] as const,
    listings: () => [...hhpQueryKeys.all, 'listings'] as const,
    listing: (id: string) => [...hhpQueryKeys.listings(), id] as const,
    reservations: () => [...hhpQueryKeys.all, 'reservations'] as const,
    reservation: (id: string) => [...hhpQueryKeys.reservations(), id] as const,
    funding: () => [...hhpQueryKeys.all, 'funding'] as const,
    guests: () => [...hhpQueryKeys.all, 'guests'] as const,
    withdrawals: () => [...hhpQueryKeys.all, 'withdrawals'] as const,
    coPayers: () => [...hhpQueryKeys.all, 'coPayers'] as const,
    dashboard: () => [...hhpQueryKeys.all, 'dashboard'] as const,
};

// Hooks for Listings
export function useListings(params?: PaginationParams & { where?: ListingFilter }) {
    return useQuery({
        queryKey: hhpQueryKeys.listings(),
        queryFn: () => hhpClient.getListings(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}

export function useInfiniteListings(params?: PaginationParams & { where?: ListingFilter }) {
    return useInfiniteQuery({
        queryKey: [...hhpQueryKeys.listings(), 'infinite'],
        queryFn: ({ pageParam = 0 }) =>
            hhpClient.getListings({ ...params, skip: pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.listingCreatedBasics.length < (params?.first || 100)) {
                return undefined;
            }
            return allPages.length * (params?.first || 100);
        },
        initialPageParam: 0,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

export function useEnhancedListings(params?: PaginationParams & { where?: ListingFilter }) {
    return useQuery({
        queryKey: [...hhpQueryKeys.listings(), 'enhanced', params],
        queryFn: () => hhpClient.getEnhancedListings(params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

export function useListing(id: string) {
    return useQuery({
        queryKey: hhpQueryKeys.listing(id),
        queryFn: async () => {
            const result = await hhpClient.getListingWithReservations(id);
            return result.listingCreatedBasic;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

export function useListingWithReservations(id: string, first?: number) {
    return useQuery({
        queryKey: [...hhpQueryKeys.listing(id), 'withReservations', first],
        queryFn: () => hhpClient.getListingWithReservations(id, first),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for fetching a single listing by listing ID
export function useListingById(listingId: string) {
    return useQuery({
        queryKey: [...hhpQueryKeys.listing(listingId), 'byId'],
        queryFn: () => hhpClient.getListingById(listingId),
        enabled: !!listingId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}

// Hooks for Reservations
export function useReservations(params?: PaginationParams & { where?: ReservationFilter }) {
    return useQuery({
        queryKey: hhpQueryKeys.reservations(),
        queryFn: () => hhpClient.getReservations(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useInfiniteReservations(params?: PaginationParams & { where?: ReservationFilter }) {
    return useInfiniteQuery({
        queryKey: [...hhpQueryKeys.reservations(), 'infinite'],
        queryFn: ({ pageParam = 0 }) =>
            hhpClient.getReservations({ ...params, skip: pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.reservationCreateds.length < (params?.first || 100)) {
                return undefined;
            }
            return allPages.length * (params?.first || 100);
        },
        initialPageParam: 0,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

export function useReservation(id: string) {
    return useQuery({
        queryKey: hhpQueryKeys.reservation(id),
        queryFn: () => hhpClient.getReservationDetails(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

export function useUserReservations(userAddress: string) {
    return useQuery({
        queryKey: [...hhpQueryKeys.reservations(), 'user', userAddress],
        queryFn: () => hhpClient.getReservations({ where: { renter: userAddress } }),
        enabled: !!userAddress,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

// Hooks for Funding
export function useReservationFunding(reservationId?: string) {
    return useQuery({
        queryKey: [...hhpQueryKeys.funding(), reservationId],
        queryFn: () => hhpClient.getReservationFunding({
            where: reservationId ? { reservationId } : undefined
        }),
        enabled: !!reservationId,
        staleTime: 1 * 60 * 1000, // 1 minute
        gcTime: 2 * 60 * 1000, // 2 minutes
    });
}

export function useUserFunding(userAddress: string) {
    return useQuery({
        queryKey: [...hhpQueryKeys.funding(), 'user', userAddress],
        queryFn: () => hhpClient.getReservationFunding({
            where: { payer: userAddress }
        }),
        enabled: !!userAddress,
        staleTime: 1 * 60 * 1000,
        gcTime: 2 * 60 * 1000,
    });
}

// Hooks for Guests
export function useReservationGuests(reservationId?: string) {
    return useQuery({
        queryKey: [...hhpQueryKeys.guests(), reservationId],
        queryFn: () => hhpClient.getGuestsAdded({
            where: reservationId ? { reservationId } : undefined
        }),
        enabled: !!reservationId,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

// Hooks for Withdrawals
export function useReservationWithdrawals(reservationId?: string) {
    return useQuery({
        queryKey: [...hhpQueryKeys.withdrawals(), reservationId],
        queryFn: () => hhpClient.getFundsWithdrawn({
            where: reservationId ? { reservationId } : undefined
        }),
        enabled: !!reservationId,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

// Hooks for Co-Payers
export function useReservationCoPayers(reservationId?: string) {
    return useQuery({
        queryKey: [...hhpQueryKeys.coPayers(), reservationId],
        queryFn: () => hhpClient.getCoPayers({
            where: reservationId ? { reservationId } : undefined
        }),
        enabled: !!reservationId,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

// Dashboard hook
export function useDashboardSummary() {
    return useQuery({
        queryKey: hhpQueryKeys.dashboard(),
        queryFn: () => hhpClient.getDashboardSummary(),
        staleTime: 1 * 60 * 1000, // 1 minute
        gcTime: 2 * 60 * 1000, // 2 minutes
    });
}

// Enhanced data hooks that combine multiple queries
export function useEnhancedListing(id: string) {
    const listingQuery = useListing(id);
    const reservationsQuery = useReservations({
        where: { listingId: id }
    });
    const fundingQuery = useReservationFunding(id);

    if (listingQuery.isLoading || reservationsQuery.isLoading || fundingQuery.isLoading) {
        return {
            data: null,
            loading: true,
            error: null,
            refetch: () => {
                listingQuery.refetch();
                reservationsQuery.refetch();
                fundingQuery.refetch();
            },
        };
    }

    if (listingQuery.error || reservationsQuery.error || fundingQuery.error) {
        return {
            data: null,
            loading: false,
            error: listingQuery.error || reservationsQuery.error || fundingQuery.error,
            refetch: () => {
                listingQuery.refetch();
                reservationsQuery.refetch();
                fundingQuery.refetch();
            },
        };
    }

    const listing = listingQuery.data;
    const reservations = reservationsQuery.data?.reservationCreateds || [];
    const funding = fundingQuery.data?.reservationFundeds || [];

    if (!listing) {
        return {
            data: null,
            loading: false,
            error: new Error('Listing not found'),
            refetch: () => {
                listingQuery.refetch();
                reservationsQuery.refetch();
                fundingQuery.refetch();
            },
        };
    }

    // Calculate enhanced data
    const totalReservations = reservations.length;
    const totalRevenue = funding.reduce((sum: bigint, fund: any) => {
        return sum + BigInt(fund.amount || '0');
    }, BigInt(0)).toString();

    const enhancedListing = {
        ...listing,
        totalReservations,
        totalRevenue,
    };

    return {
        data: enhancedListing,
        loading: false,
        error: null,
        refetch: () => {
            listingQuery.refetch();
            reservationsQuery.refetch();
            fundingQuery.refetch();
        },
    };
}

export function useEnhancedReservation(id: string) {
    const reservationQuery = useReservation(id);
    const fundingQuery = useReservationFunding(id);
    const guestsQuery = useReservationGuests(id);

    if (reservationQuery.isLoading || fundingQuery.isLoading || guestsQuery.isLoading) {
        return {
            data: null,
            loading: true,
            error: null,
            refetch: () => {
                reservationQuery.refetch();
                fundingQuery.refetch();
                guestsQuery.refetch();
            },
        };
    }

    if (reservationQuery.error || fundingQuery.error || guestsQuery.error) {
        return {
            data: null,
            loading: false,
            error: reservationQuery.error || fundingQuery.error || guestsQuery.error,
            refetch: () => {
                reservationQuery.refetch();
                fundingQuery.refetch();
                guestsQuery.refetch();
            },
        };
    }

    const reservation = reservationQuery.data?.reservationCreated;
    const funding = fundingQuery.data?.reservationFundeds || [];
    const guests = guestsQuery.data?.guestAddeds || [];

    if (!reservation) {
        return {
            data: null,
            loading: false,
            error: new Error('Reservation not found'),
            refetch: () => {
                reservationQuery.refetch();
                fundingQuery.refetch();
                guestsQuery.refetch();
            },
        };
    }

    // Calculate enhanced data
    const totalFunded = funding.reduce((sum: bigint, fund: any) => {
        return sum + BigInt(fund.amount || '0');
    }, BigInt(0)).toString();

    const guestAddresses = guests.map((g: any) => g.guest);
    const isActive = new Date(reservation.endDate * 1000) > new Date();

    // Calculate if fully funded (this would need to be compared with listing price)
    const isFullyFunded = false; // TODO: Implement proper calculation

    const enhancedReservation = {
        ...reservation,
        totalFunded,
        guests: guestAddresses,
        isActive,
        isFullyFunded,
    };

    return {
        data: enhancedReservation,
        loading: false,
        error: null,
        refetch: () => {
            reservationQuery.refetch();
            fundingQuery.refetch();
            guestsQuery.refetch();
        },
    };
}

// Utility hook for invalidating queries
export function useInvalidateHHPQueries() {
    const queryClient = useQueryClient();

    return {
        invalidateListings: () => queryClient.invalidateQueries({ queryKey: hhpQueryKeys.listings() }),
        invalidateReservations: () => queryClient.invalidateQueries({ queryKey: hhpQueryKeys.reservations() }),
        invalidateFunding: () => queryClient.invalidateQueries({ queryKey: hhpQueryKeys.funding() }),
        invalidateAll: () => queryClient.invalidateQueries({ queryKey: hhpQueryKeys.all }),
    };
}
