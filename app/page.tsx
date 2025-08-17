"use client";

import { useState } from "react";
import { useDashboardSummary } from "@/hooks/use-hhp-data";
import { useEnhancedListingsWithIPFS } from "@/hooks/use-enhanced-listings";
import { formatUnits } from "ethers";
import {
  Search,
  Menu,
  TrendingUp,
  RefreshCw,
  Home,
  MapPin,
  Users,
  Star,
  Heart,
  Info,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { usePrivy } from "@privy-io/react-auth";
import { BottomNavigation } from "@/components/bottom-navigation";

// Utility function to get fallback icon
function getFallbackIcon(icon: any) {
  if (icon && typeof icon === "function") return icon;
  return Info; // Default fallback icon
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Apartments");
  const { user, authenticated, ready } = usePrivy();

  // Fetch HHP dashboard data
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
    refetch: dashboardRefetch,
  } = useDashboardSummary();

  // Fetch HHP listings with IPFS metadata
  const {
    data: enhancedListings,
    isLoading: listingsLoading,
    error: listingsError,
  } = useEnhancedListingsWithIPFS({
    first: 6,
  });

  // Transform enhanced HHP listings to property format
  const properties =
    enhancedListings?.map((listing: any) => ({
      id: listing.id,
      title:
        listing.displayName || `Listing #${listing.listingId || listing.id}`,
      location: listing.displayLocation || "Location TBD",
      price: parseFloat(formatUnits(listing.nightlyRate || "0", 6)), // 6 decimal places
      rating: 4.85, // Default rating
      image: listing.metadata?.images?.[0] || "/property-palermo-1.png", // Use IPFS image if available
      amenities: [
        {
          name: listing.requireProof ? "Proof Required" : "No Proof Required",
          icon: Info,
        },
        { name: `Max ${listing.maxGuests || 0} guests`, icon: Users },
        { name: "Blockchain verified", icon: Home },
        {
          name: listing.hasMetadata ? "Has Metadata" : "No Metadata",
          icon: Info,
        },
        {
          name: listing.hasPrivateData
            ? "Private Data Available"
            : "No Private Data",
          icon: Info,
        },
      ],
      isFavorite: false,
      hhpData: listing, // Store enhanced HHP data
      metadata: listing.metadata, // Store IPFS metadata
      privateData: listing.privateDataCid
        ? { encPrivDataCid: listing.privateDataCid }
        : undefined, // Store private data info
    })) || [];

  console.log({ properties });

  const categories = [
    { name: "Developers", active: true },
    { name: "Front-End", active: false },
    { name: "Back-end", active: false },
    { name: "Full-Stack", active: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          {authenticated && user && (
            <div className="mb-4">
              <p className="text-gray-600">Welcome back,</p>
              <h2 className="text-xl font-semibold">
                {user?.email?.address?.split("@")[0] ||
                  user?.wallet?.address?.slice(0, 6) ||
                  "User"}
                !
              </h2>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                className="pl-10 bg-white/80 backdrop-blur-sm border-none rounded-xl h-12 shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-xl border-2 border-gray-300 bg-white/80 backdrop-blur-sm hover:scale-110 transition-all duration-200"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setActiveTab("Apartments")}
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 shadow-sm transition-all duration-300 ${
                  activeTab === "Apartments"
                    ? "bg-blue-500 shadow-md"
                    : "bg-blue-100"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded shadow-sm ${
                    activeTab === "Apartments"
                      ? "bg-white"
                      : "bg-gradient-to-br from-blue-500 to-blue-600"
                  }`}
                ></div>
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-300 ${
                  activeTab === "Apartments"
                    ? "text-black border-b-2 border-blue-600 pb-1"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Apartments
              </span>
            </div>
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setActiveTab("Events")}
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 shadow-sm transition-all duration-300 ${
                  activeTab === "Events"
                    ? "bg-orange-500 shadow-md"
                    : "bg-orange-100"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded shadow-sm ${
                    activeTab === "Events"
                      ? "bg-white"
                      : "bg-gradient-to-br from-orange-500 to-orange-600"
                  }`}
                ></div>
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-300 ${
                  activeTab === "Events"
                    ? "text-black border-b-2 border-orange-600 pb-1"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Events
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* HHP Dashboard Section */}
      {!dashboardLoading && !dashboardError && dashboardData && (
        <div className="px-4 mb-6">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                HHP Protocol Stats
              </h2>
              <Button
                onClick={() => dashboardRefetch()}
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:text-blue-600"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Card className="text-center p-3 bg-white/80 backdrop-blur-sm">
                <div className="text-2xl font-bold text-blue-600">
                  {dashboardData?.listingCreatedBasics?.length || 0}
                </div>
                <div className="text-xs text-gray-600">Listings</div>
              </Card>
              <Card className="text-center p-3 bg-white/80 backdrop-blur-sm">
                <div className="text-2xl font-bold text-green-600">
                  {dashboardData?.reservationCreateds?.length || 0}
                </div>
                <div className="text-xs text-gray-600">Reservations</div>
              </Card>
              <Card className="text-center p-3 bg-white/80 backdrop-blur-sm">
                <div className="text-2xl font-bold text-purple-600">
                  {dashboardData?.reservationFundeds?.length > 0
                    ? formatUnits(
                        dashboardData.reservationFundeds.reduce(
                          (sum: bigint, fund: any) =>
                            sum + BigInt(fund?.amount || "0"),
                          BigInt(0)
                        ),
                        6 // pyUSD has 6 decimals
                      ).slice(0, 6)
                    : "0"}
                </div>
                <div className="text-xs text-gray-600">
                  Total Funded (pyUSD)
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 pb-24">
        {/* Events Tab Content */}
        {activeTab === "Events" && (
          <>
            <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Explore Hackathon Events!
            </h1>

            {/* Add your hackathon events content here */}
            <div className="space-y-4 mb-8">
              <Card className="rounded-2xl shadow-sm bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-600">
                      Hackathon
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    ETH Global Buenos Aires
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Buenos Aires, Argentina
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Build the future of Web3 with the best developers worldwide.
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          250 attendees
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        Aug 15-17, 2025
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Prize Pool</div>
                      <div className="font-bold text-green-600">50 ETH</div>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 rounded-lg">
                    Join Event
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Apartments Tab Content */}
        {activeTab === "Apartments" && (
          <>
            {/* HHP Property Cards */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">HHP Listings</h2>
              <Button
                variant="ghost"
                className="text-blue-500 font-medium hover:text-blue-600 transition-colors"
                asChild
              >
                <Link href="/explore">View All</Link>
              </Button>
            </div>
            <div className="space-y-4 mb-8">
              {/* Loading State */}
              {listingsLoading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-muted-foreground">
                    Loading HHP listings...
                  </p>
                </div>
              )}

              {/* Error State */}
              {listingsError && (
                <div className="text-center py-12">
                  <p className="text-destructive mb-4">
                    Error loading HHP listings
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Check your subgraph connection
                  </p>
                </div>
              )}

              {/* No Listings */}
              {!listingsLoading &&
                !listingsError &&
                properties.length === 0 && (
                  <div className="text-center py-12">
                    <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No HHP listings found
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Check back later or visit the explore page
                    </p>
                  </div>
                )}

              {/* Listings */}
              {!listingsLoading &&
                !listingsError &&
                properties.length > 0 &&
                properties.map((property: any) => (
                  <Link
                    key={property.id}
                    href={`/property/${property?.hhpData?.listingId}`}
                  >
                    <Card className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white">
                      <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-600">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white transition-all duration-200 hover:scale-110"
                          >
                            <Heart className="w-5 h-5 text-green-500" />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white transition-all duration-200 hover:scale-110"
                          >
                            <Info className="w-5 h-5" />
                          </Button>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="text-xl font-semibold mb-1">
                            {property.title}
                          </h3>
                          <div className="flex items-center gap-1 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{property.location}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg font-semibold">
                              ${property.price}/Day
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{property.rating}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {property.amenities?.map(
                              (amenity: any, index: number) => {
                                const IconComponent = getFallbackIcon(
                                  amenity?.icon
                                );
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center gap-1 px-3 py-1 bg-black/30 rounded-full text-xs backdrop-blur-sm"
                                  >
                                    <IconComponent className="w-3 h-3" />
                                    <span>
                                      {amenity?.name || `Amenity ${index + 1}`}
                                    </span>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
            </div>
          </>
        )}

        {/* Find Hacker Homies Section */}
        <h2 className="text-lg font-semibold mb-4">Find Hacker Homies</h2>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={category.active ? "default" : "secondary"}
              className={`h-16 rounded-2xl text-base font-medium transition-all duration-200 hover:scale-105 ${
                category.active
                  ? "bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-lg"
                  : "bg-white/80 text-gray-700 hover:bg-white shadow-sm"
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="Home" />
    </div>
  );
}
