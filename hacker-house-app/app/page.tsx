"use client";

import { useState, useEffect } from "react";
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
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<string>("");
  const [isSwiping, setIsSwiping] = useState(false);
  const { user, authenticated, ready } = usePrivy();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      window.location.href = "/login";
    }
  }, [ready, authenticated]);

  // Show loading while checking authentication
  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!authenticated) {
    return null;
  }

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

  // Swipe functionality
  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left" && currentPropertyIndex < properties.length - 1) {
      setCurrentPropertyIndex((prev) => prev + 1);
    } else if (direction === "right" && currentPropertyIndex > 0) {
      setCurrentPropertyIndex((prev) => prev - 1);
    }
    setSwipeDirection(direction);
    setTimeout(() => setSwipeDirection(""), 300);
  };

  // Touch handlers for swipe
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null
  );

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe && Math.abs(distanceX) > 50) {
      if (distanceX > 0) {
        handleSwipe("left"); // Swipe left = next property
      } else {
        handleSwipe("right"); // Swipe right = previous property
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handleSwipe("right"); // Previous property
      } else if (e.key === "ArrowRight") {
        handleSwipe("left"); // Next property
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPropertyIndex, properties.length]);

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
            <div className="mb-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    HHP Listings
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Discover verified blockchain properties
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-medium px-6 py-2 rounded-xl transition-all duration-200 hover:scale-105"
                  asChild
                >
                  <Link href="/explore">View All</Link>
                </Button>
              </div>

              {/* Loading State */}
              {listingsLoading && (
                <div className="text-center py-16">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-100 rounded-full mx-auto mb-4"></div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-600 font-medium">
                    Loading HHP listings...
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Fetching from blockchain
                  </p>
                </div>
              )}

              {/* Error State */}
              {listingsError && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-red-600 font-semibold mb-2">
                    Error loading HHP listings
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Check your subgraph connection
                  </p>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* No Listings */}
              {!listingsLoading &&
                !listingsError &&
                properties.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Home className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium mb-2">
                      No HHP listings found
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      Check back later or visit the explore page
                    </p>
                    <Button
                      variant="outline"
                      className="border-gray-200 text-gray-600 hover:bg-gray-50"
                      asChild
                    >
                      <Link href="/explore">Explore Properties</Link>
                    </Button>
                  </div>
                )}

              {/* TikTok/Tinder Style Single Property Frame */}
              {!listingsLoading && !listingsError && properties.length > 0 && (
                <div className="relative">
                  {/* Main Property Frame - Full Screen Style */}
                  <div
                    className={`relative h-[80vh] max-h-[600px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl transition-transform duration-300 ${
                      swipeDirection === "left"
                        ? "transform -translate-x-full"
                        : swipeDirection === "right"
                        ? "transform translate-x-full"
                        : ""
                    }`}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  >
                    {/* Property Image Background */}
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${
                          properties[currentPropertyIndex]?.image ||
                          "/property-palermo-1.png"
                        })`,
                      }}
                    >
                      {/* Dark Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                    </div>

                    {/* Top Action Buttons - Always Visible */}
                    <div className="absolute top-6 right-6 flex flex-col gap-4">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="w-14 h-14 rounded-full bg-white/95 hover:bg-white shadow-xl transition-all duration-200 hover:scale-110 border-0"
                      >
                        <Heart className="w-6 h-6 text-red-500" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="w-14 h-14 rounded-full bg-white/95 hover:bg-white shadow-xl transition-all duration-200 hover:scale-110 border-0"
                      >
                        <Info className="w-6 h-6 text-blue-600" />
                      </Button>
                    </div>

                    {/* Price Badge - Top Left */}
                    <div className="absolute top-6 left-6">
                      <div className="bg-white/95 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-xl border border-white/20">
                        <div className="text-sm text-gray-600 font-medium">
                          Price
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          <span className="text-xs font-normal text-gray-500 mr-1">
                            pyUSD{" "}
                          </span>
                          {properties[currentPropertyIndex]?.price || "89"}
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            /day
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Property Info - Bottom Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      {/* Blockchain Verification Badge */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-green-300 bg-black/30 px-3 py-1 rounded-full">
                          Blockchain Verified
                        </span>
                      </div>

                      {/* Property Title */}
                      <h2 className="text-4xl font-bold mb-3 text-shadow-lg">
                        {properties[currentPropertyIndex]?.title ||
                          "Room in Palermo"}
                      </h2>

                      {/* Location and Rating */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-200" />
                          <span className="text-lg text-blue-100 font-medium">
                            {properties[currentPropertyIndex]?.location ||
                              "ETH Global Buenos Aires"}
                          </span>
                        </div>
                        <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-lg text-yellow-100 font-semibold">
                            {properties[currentPropertyIndex]?.rating || "4.85"}
                          </span>
                        </div>
                      </div>

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-3 mb-6">
                        {properties[currentPropertyIndex]?.amenities
                          ?.slice(0, 4)
                          .map((amenity: any, index: number) => {
                            const IconComponent = getFallbackIcon(
                              amenity?.icon
                            );
                            return (
                              <div
                                key={index}
                                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm border border-white/30 hover:bg-white/30 transition-all duration-200"
                              >
                                <IconComponent className="w-4 h-4 text-blue-200" />
                                <span className="text-white font-medium">
                                  {amenity?.name || `Feature ${index + 1}`}
                                </span>
                              </div>
                            );
                          })}
                      </div>

                      {/* Bottom Action Bar */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                            <Home className="w-6 h-6 text-blue-200" />
                          </div>
                          <div>
                            <p className="text-sm text-blue-100 font-medium">
                              HHP Protocol
                            </p>
                            <p className="text-xs text-blue-200">
                              Smart Contract Verified
                            </p>
                          </div>
                        </div>
                        <Button
                          size="lg"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-xl"
                          asChild
                        >
                          <Link
                            href={`/property/${properties[currentPropertyIndex]?.hhpData?.listingId}`}
                          >
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Dots */}
                  <div className="flex justify-center mt-6 space-x-2">
                    {properties.map((_: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPropertyIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 ${
                          index === currentPropertyIndex
                            ? "bg-blue-600 w-8"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Swipe Instructions and Navigation */}
                  <div className="text-center mt-4 space-y-2">
                    <p className="text-sm text-gray-500">
                      Swipe left/right to explore more properties
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSwipe("right")}
                        disabled={currentPropertyIndex === 0}
                        className="px-4 py-2 text-sm"
                      >
                        ← Previous
                      </Button>
                      <span className="text-sm text-gray-500 py-2">
                        {currentPropertyIndex + 1} of {properties.length}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSwipe("left")}
                        disabled={
                          currentPropertyIndex === properties.length - 1
                        }
                        className="px-4 py-2 text-sm"
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="Home" />
    </div>
  );
}
