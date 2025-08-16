"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  Info,
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Home,
  Briefcase,
  Clock,
  Shield,
  Wallet,
  Calendar,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useListingById } from "@/hooks/use-hhp-data";
import { useFavorites } from "@/hooks/use-favorites";
import { formatUnits } from "ethers";
import { formatAddress } from "@/lib/utils";
import { BookingModal } from "@/components/booking/booking-modal";

// Type definitions for the listing data
interface ListingData {
  listingCreatedBasics: Array<{
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
  }>;
  listingMetadataURISets: Array<{
    id: string;
    listingId: string;
    metadataURI: string;
    blockNumber: number;
    blockTimestamp: number;
    transactionHash: string;
  }>;
  listingPrivateDataSets: Array<{
    id: string;
    listingId: string;
    privDataHash: string;
    encPrivDataCid: string;
    blockNumber: number;
    blockTimestamp: number;
    transactionHash: string;
  }>;
}

// Utility function to get fallback icon
function getFallbackIcon(icon: any) {
  if (icon && typeof icon === "function") return icon;
  return Info; // Default fallback icon
}

// Utility function to get amenity text
function getAmenityText(amenity: any): string {
  if (typeof amenity === "string") return amenity;
  return amenity.name || amenity || "Unknown Amenity";
}

export default function PropertyDetailPage() {
  const params = useParams();
  const listingId = params.id as string; // This will be "1", "2", "3", etc.
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { toggleFavorite, isFavorite: checkIsFavorite } = useFavorites();

  // Fetch listing data by listing ID
  const {
    data: listingData,
    isLoading,
    error,
    refetch,
  } = useListingById(listingId) as {
    data: ListingData | undefined;
    isLoading: boolean;
    error: any;
    refetch: () => void;
  };

  // Check if this property is in favorites
  useEffect(() => {
    if (listingData?.listingCreatedBasics?.[0]) {
      const listing = listingData.listingCreatedBasics[0];
      setIsFavorite(checkIsFavorite(listing.id));
    }
  }, [listingData, checkIsFavorite]);

  const handleFavoriteToggle = () => {
    if (listingData?.listingCreatedBasics?.[0]) {
      const listing = listingData.listingCreatedBasics[0];
      toggleFavorite({
        id: listing.id,
        title: `Listing #${listing.listingId}`,
        location: "Location TBD", // Will be updated when we get IPFS metadata
        price: parseFloat(formatUnits(listing.nightlyRate || "0", 6)),
        rating: 4.85,
        image: "/property-palermo-1.png",
        amenities: [],
      });
      setIsFavorite(!isFavorite);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !listingData?.listingCreatedBasics?.[0]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="text-center">
            <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Listing #{listingId} Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The listing you're looking for doesn't exist or couldn't be
              loaded.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <Button asChild>
                <Link href="/explore">Browse Properties</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const listing = listingData.listingCreatedBasics[0];
  const metadata = listingData.listingMetadataURISets?.[0];
  const privateData = listingData.listingPrivateDataSets?.[0];
  const price = parseFloat(formatUnits(listing.nightlyRate || "0", 6));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-br from-blue-600 to-purple-700">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-4 left-4">
            <Link href="/explore">
              <Button
                size="icon"
                variant="secondary"
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-white/30"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Button>
            </Link>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className={`w-10 h-10 rounded-full backdrop-blur-sm border-white/30 ${
                isFavorite ? "bg-red-500/80" : "bg-white/20"
              }`}
              onClick={handleFavoriteToggle}
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? "text-white fill-white" : "text-white"
                }`}
              />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-white/30"
            >
              <Info className="w-5 h-5 text-white" />
            </Button>
          </div>

          {/* Property Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <h1 className="text-2xl font-bold text-white mb-2">
              HHP Listing #{listing.listingId}
            </h1>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-4 h-4" />
              <span>Location TBD</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Price and Rating */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-3xl font-bold text-gray-900">
                ${price}/night
              </span>
              <span className="text-gray-600 ml-2">pyUSD</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">4.85</span>
              <span className="text-gray-600">• HHP Verified</span>
            </div>
          </div>
        </div>

        {/* HHP Protocol Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              HHP Protocol Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Builder</span>
                <p className="font-medium text-sm">
                  {formatAddress(listing.builder)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Max Guests</span>
                <p className="font-medium text-sm">
                  {listing.maxGuests || "Unknown"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Proof Required</span>
                <p className="font-medium text-sm">
                  {listing.requireProof ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Block</span>
                <p className="font-medium text-sm">
                  {listing.blockNumber || "Unknown"}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Payment Token</span>
                <span className="font-medium">
                  {formatAddress(listing.paymentToken)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Transaction Hash</span>
                <a
                  href={`https://sepolia.arbiscan.io/tx/${listing.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  {listing.transactionHash?.slice(0, 8)}...
                  {listing.transactionHash?.slice(-6)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Description */}
        {metadata?.metadataURI && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>IPFS Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                This property has metadata stored on IPFS.
              </p>
              <div className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                URI: {metadata.metadataURI}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Amenities */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm">
                Max {listing.maxGuests} guests
              </Badge>
              <Badge variant="secondary" className="text-sm">
                {listing.requireProof ? "Proof Required" : "No Proof Required"}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Blockchain verified
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* HHP Protocol Features */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>HHP Protocol Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">Blockchain Verified</p>
                <p className="text-sm text-gray-600">
                  This property is verified on the HHP protocol
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">
                  Created{" "}
                  {new Date(
                    (listing.blockTimestamp || 0) * 1000
                  ).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Block timestamp: {listing.blockTimestamp}
                </p>
              </div>
            </div>
            {listing.requireProof && (
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">Proof Required</p>
                  <p className="text-sm text-gray-600">
                    Eligibility proof needed for booking
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Private Data Info */}
        {privateData?.encPrivDataCid && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Private Data Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                This property has additional private information available
                (encrypted on IPFS).
              </p>
              <div className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                CID: {privateData.encPrivDataCid}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-900">
              ${price}/night
            </p>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">4.85 • HHP Verified</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-gray-300">
              View on Explorer
            </Button>
            <Button
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        listingId={listingId}
        nightlyRate={listing.nightlyRate}
        maxGuests={listing.maxGuests}
        requireProof={listing.requireProof}
      />
    </div>
  );
}
