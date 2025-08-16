'use client';

import { useQuery } from '@tanstack/react-query';
import { useEnhancedListings } from './use-hhp-data';
import { batchFetchIPFSMetadata, fetchIPFSMetadata, type IPFSMetadata } from '@/lib/ipfs';
import { useMemo } from 'react';

export interface EnhancedListing {
    // Subgraph data
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

    // IPFS metadata (if available)
    metadata?: IPFSMetadata;
    privateDataCid?: string;

    // Computed fields
    displayName: string;
    displayLocation: string;
    hasMetadata: boolean;
    hasPrivateData: boolean;
}

export function useEnhancedListingsWithIPFS(params?: {
    first?: number;
    where?: any;
}) {
    const {
        data: subgraphData,
        isLoading: subgraphLoading,
        error: subgraphError,
        refetch: subgraphRefetch,
    } = useEnhancedListings(params);

    // Fetch IPFS metadata for all listings
    const {
        data: ipfsData,
        isLoading: ipfsLoading,
        error: ipfsError,
        refetch: ipfsRefetch,
    } = useQuery({
        queryKey: ['ipfs-metadata', subgraphData?.listingCreatedBasics],
        queryFn: async () => {
            if (!subgraphData?.listingCreatedBasics) return new Map();

            const metadataUris = subgraphData.listingMetadataURISets
                .map((set: any) => set.metadataURI)
                .filter(Boolean);

            console.log('Fetching IPFS metadata for URIs:', metadataUris);

            try {
                const result = await batchFetchIPFSMetadata(metadataUris);
                console.log('IPFS metadata result:', result);
                return result;
            } catch (error) {
                console.error('Error fetching IPFS metadata:', error);
                return new Map();
            }
        },
        enabled: !!subgraphData?.listingCreatedBasics,
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
    });

    console.log({ subgraphData });

    // Combine subgraph and IPFS data
    const enhancedListings = useMemo(() => {
        if (!subgraphData?.listingCreatedBasics) return [];

        return subgraphData.listingCreatedBasics.map((listing: any) => {
            // Find associated metadata and private data
            const metadataSet = subgraphData.listingMetadataURISets.find(
                (m: any) => m.listingId === listing.listingId
            );
            const privateDataSet = subgraphData.listingPrivateDataSets.find(
                (p: any) => p.listingId === listing.listingId
            );

            // Get IPFS metadata
            const metadata = metadataSet?.metadataURI && ipfsData?.get(metadataSet.metadataURI);

            // Create enhanced listing
            const enhanced: EnhancedListing = {
                ...listing,
                metadata,
                privateDataCid: privateDataSet?.encPrivDataCid,

                // Computed fields
                displayName: metadata?.name || `Listing #${listing.listingId}`,
                displayLocation: metadata?.location || 'Location TBD',
                hasMetadata: !!metadata,
                hasPrivateData: !!privateDataSet?.encPrivDataCid,
            };

            return enhanced;
        });
    }, [subgraphData, ipfsData]);


    console.log({ enhancedListings });

    return {
        data: enhancedListings,
        isLoading: subgraphLoading || ipfsLoading,
        error: subgraphError || ipfsError,
        refetch: () => {
            subgraphRefetch();
            ipfsRefetch();
        },

        // Raw data for debugging
        subgraphData,
        ipfsData,

        // Individual loading states
        subgraphLoading,
        ipfsLoading,
    };
}
