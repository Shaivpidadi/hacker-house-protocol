"use client";

import { useState } from "react";
import {
  Search,
  Menu,
  Calendar,
  Users,
  MapPin,
  Home,
  Wallet,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNavigation } from "@/components/bottom-navigation";
import { PropertyCard } from "@/components/explore/property-card";
import { useEnhancedListings } from "@/hooks/use-hhp-data";
import { formatAddress } from "@/lib/utils";
import { formatUnits } from "ethers"; // Added formatUnits import

export function Explore() {
  const [activeTab, setActiveTab] = useState("Apartments");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch real HHP listings from subgraph with enhanced data
  const { data, isLoading, error, refetch } = useEnhancedListings({
    first: 50,
    where: {
      active: true,
      ...(searchTerm && {
        name_contains_nocase: searchTerm,
        location_contains_nocase: searchTerm,
      }),
    },
  });

  const listings = data?.listingCreatedBasics || [];
  const metadataSets = data?.listingMetadataURISets || [];
  const privateDataSets = data?.listingPrivateDataSets || [];

  // Transform HHP listings to property format for existing PropertyCard component
  const properties = listings.map((listing: any) => {
    // Find associated metadata and private data
    const metadata = metadataSets.find(
      (m: any) => m.listingId === listing.listingId
    );
    const privateData = privateDataSets.find(
      (p: any) => p.listingId === listing.listingId
    );

    return {
      id: listing.id,
      title: listing.name || `Listing #${listing.listingId}`, // Changed from listing.id to listing.listingId
      location: listing.location || "Location TBD",
      price: parseFloat(formatUnits(listing.nightlyRate, 6)), // Changed from formatEther to formatUnits
      rating: 4.85, // Default rating since HHP doesn't have ratings yet
      image: "/property-palermo-1.png", // Default image
      amenities: [
        listing.requireProof ? "Proof Required" : "No Proof Required",
        `Max ${listing.maxGuests} guests`,
        "Blockchain verified",
        `Builder: ${formatAddress(listing.builder)}`,
        metadata?.metadataURI ? "Has Metadata" : "No Metadata",
        privateData?.encPrivDataCid
          ? "Private Data Available"
          : "No Private Data",
      ],
      isFavorite: false,
      hhpData: listing, // Store original HHP data
      metadata,
      privateData,
    };
  });

  const events = [
    {
      id: 1,
      title: "ETH Global Buenos Aires",
      location: "Buenos Aires, Argentina",
      date: "Aug 15-17, 2025",
      participants: 250,
      image: "/property-palermo-1.png",
      tags: ["Ethereum", "DeFi", "NFTs"],
    },
    {
      id: 2,
      title: "ETH Berlin Hackathon",
      location: "Berlin, Germany",
      date: "Sep 20-22, 2025",
      participants: 180,
      image: "/property-palermo-2.png",
      tags: ["Layer 2", "ZK", "Privacy"],
    },
    {
      id: 3,
      title: "Solana Breakpoint",
      location: "Amsterdam, Netherlands",
      date: "Oct 10-12, 2025",
      participants: 320,
      image: "/property-palermo-3.png",
      tags: ["Solana", "Web3", "Gaming"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search listings..."
                className="pl-10 bg-gray-100 border-none rounded-xl h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-xl border-2 border-black bg-transparent"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <button
              onClick={() => setActiveTab("Apartments")}
              className="flex flex-col items-center transition-all duration-200"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded"></div>
              </div>
              <span
                className={`text-sm font-medium transition-all duration-200 ${
                  activeTab === "Apartments"
                    ? "text-black border-b-2 border-black pb-1"
                    : "text-gray-500"
                }`}
              >
                Apartments
              </span>
            </button>
            <button
              onClick={() => setActiveTab("Events")}
              className="flex flex-col items-center transition-all duration-200"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded"></div>
              </div>
              <span
                className={`text-sm font-medium transition-all duration-200 ${
                  activeTab === "Events"
                    ? "text-black border-b-2 border-black pb-1"
                    : "text-gray-500"
                }`}
              >
                Events
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-24 space-y-4">
        {activeTab === "Apartments" ? (
          <>
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading HHP listings...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">Error loading listings</p>
                <Button onClick={() => refetch()} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            )}

            {/* Listings */}
            {!isLoading && !error && properties.length === 0 && (
              <div className="text-center py-12">
                <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No listings found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search or check back later
                </p>
              </div>
            )}

            {!isLoading && !error && properties.length > 0 && (
              <>
                {properties.map((property: any) => (
                  <PropertyCard key={property.id} property={property} />
                ))}

                {/* Results Count */}
                <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                  Showing {properties.length} listings from HHP protocol
                  {metadataSets.length > 0 &&
                    ` • ${metadataSets.length} with metadata`}
                  {privateDataSets.length > 0 &&
                    ` • ${privateDataSets.length} with private data`}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 bg-gradient-to-br from-orange-600 to-red-600 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg mb-1">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-4 text-white/90 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {event.participants}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <BottomNavigation activeTab="Explore" />
    </div>
  );
}
