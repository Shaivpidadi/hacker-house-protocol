// IPFS utility functions for fetching metadata from Pinata
export interface IPFSMetadata {
    name?: string;
    location?: string;
    description?: string;
    images?: string[];
    amenities?: string[];
    [key: string]: any; // Allow additional fields
}

export interface IPFSPrivateData {
    contactInfo?: string;
    specialPricing?: string;
    internalNotes?: string;
    [key: string]: any;
}

// Convert IPFS URI to Pinata gateway URL
export function getPinataUrl(ipfsUri: string): string {
    if (!ipfsUri) return '';

    // Handle different IPFS URI formats
    if (ipfsUri.startsWith('ipfs://')) {
        const cid = ipfsUri.replace('ipfs://', '');
        // Try Pinata first, fallback to Cloudflare
        return `https://gateway.pinata.cloud/ipfs/${cid}`;
    }

    if (ipfsUri.startsWith('Qm') || ipfsUri.startsWith('bafy')) {
        // Try Pinata first, fallback to Cloudflare
        return `https://gateway.pinata.cloud/ipfs/${ipfsUri}`;
    }

    // If it's already a full URL, return as is
    if (ipfsUri.startsWith('http')) {
        return ipfsUri;
    }

    return ipfsUri;
}

// Get fallback IPFS gateway URL
export function getFallbackIPFSUrl(ipfsUri: string): string {
    if (!ipfsUri) return '';

    if (ipfsUri.startsWith('ipfs://')) {
        const cid = ipfsUri.replace('ipfs://', '');
        return `https://cloudflare-ipfs.com/ipfs/${cid}`;
    }

    if (ipfsUri.startsWith('Qm') || ipfsUri.startsWith('bafy')) {
        return `https://cloudflare-ipfs.com/ipfs/${ipfsUri}`;
    }

    return ipfsUri;
}

// Fetch metadata from IPFS
export async function fetchIPFSMetadata(ipfsUri: string): Promise<IPFSMetadata | null> {
    try {
        if (!ipfsUri) return null;

        // Try primary gateway (Pinata)
        let url = getPinataUrl(ipfsUri);
        let response = await fetch(url, { signal: AbortSignal.timeout(10000) }); // 10 second timeout

        // If primary fails, try fallback
        if (!response.ok) {
            console.warn(`Primary gateway failed for ${ipfsUri}, trying fallback...`);
            url = getFallbackIPFSUrl(ipfsUri);
            response = await fetch(url, { signal: AbortSignal.timeout(10000) });
        }

        if (!response.ok) {
            console.warn(`Failed to fetch IPFS metadata from ${url}: ${response.status}`);
            // Return mock data for testing when IPFS is unavailable
            return getMockMetadata(ipfsUri);
        }

        const metadata = await response.json();
        return metadata;
    } catch (error) {
        console.error('Error fetching IPFS metadata:', error);
        // Return mock data for testing when IPFS is unavailable
        return getMockMetadata(ipfsUri);
    }
}

// Mock metadata for testing when IPFS is unavailable
function getMockMetadata(ipfsUri: string): IPFSMetadata {
    // Generate consistent mock data based on the IPFS URI
    const hash = ipfsUri.replace('ipfs://', '').slice(0, 8);

    return {
        name: `Hacker House ${hash}`,
        location: `Location ${hash.slice(0, 4)}`,
        description: `A modern hacker house with all the amenities you need for productive coding sessions.`,
        images: [
            "/property-palermo-1.png",
            "/property-palermo-2.png",
            "/property-palermo-3.png"
        ],
        amenities: [
            "High-speed WiFi",
            "24/7 access",
            "Kitchen facilities",
            "Meeting rooms",
            "Parking available"
        ]
    };
}

// Fetch private data from IPFS (encrypted)
export async function fetchIPFSPrivateData(ipfsCid: string): Promise<IPFSPrivateData | null> {
    try {
        if (!ipfsCid) return null;

        const url = getPinataUrl(ipfsCid);
        const response = await fetch(url);

        if (!response.ok) {
            console.warn(`Failed to fetch IPFS private data from ${url}: ${response.status}`);
            return null;
        }

        // Note: This data is encrypted, so we'll get encrypted content
        // In a real app, you'd need to decrypt this with the appropriate key
        const encryptedData = await response.text();
        return { encryptedData };
    } catch (error) {
        console.error('Error fetching IPFS private data:', error);
        return null;
    }
}

// Batch fetch multiple IPFS metadata
export async function batchFetchIPFSMetadata(ipfsUris: string[]): Promise<Map<string, IPFSMetadata>> {
    const results = new Map<string, IPFSMetadata>();

    const promises = ipfsUris.map(async (uri) => {
        if (!uri) return;
        const metadata = await fetchIPFSMetadata(uri);
        if (metadata) {
            results.set(uri, metadata);
        }
    });

    await Promise.allSettled(promises);
    return results;
}
