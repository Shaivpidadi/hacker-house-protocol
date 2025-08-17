"use client";

import { useState } from "react";
import {
  Heart,
  Info,
  ChevronDown,
  ChevronUp,
  MapPin,
  Users,
  Star,
  Calendar,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useFavorites } from "@/hooks/use-favorites";

// Utility function to get fallback icon
function getFallbackIcon(icon: any) {
  if (icon && typeof icon === "function") return icon;
  return Info; // Default fallback icon
}

// Utility function to get amenity text
function getAmenityText(
  amenity: string | { name: string; icon?: any }
): string {
  if (typeof amenity === "string") return amenity;
  return amenity.name || "Unknown Amenity";
}

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  amenities: any[]; // Allow flexible amenity format
  isFavorite: boolean;
  hhpData?: any;
  metadata?: any;
  privateData?: any;
}

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  console.log({ property });
  const [isExpanded, setIsExpanded] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({
      id: property.id,
      title: property.title,
      location: property.location,
      price: property.price,
      rating: property.rating,
      image: property.image,
      amenities: property.amenities,
    });
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Property Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-400 to-gray-700">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="sm"
              className={`w-10 h-10 rounded-full p-0 ${
                favorite
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-white/80 hover:bg-white"
              }`}
              onClick={handleFavoriteClick}
            >
              <Heart
                className={`w-5 h-5 ${
                  favorite ? "text-white fill-white" : "text-gray-600"
                }`}
              />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-10 h-10 rounded-full border-2 border-white bg-white/80 p-0"
              onClick={handleExpandClick}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-black" />
              ) : (
                <ChevronDown className="w-5 h-5 text-black" />
              )}
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg text-white">
                  {property.title}
                </h3>
                <p className="text-gray-200 text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {property.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <span className="font-semibold text-white">
                ${property.price}/Day
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-white">
                  {property.rating}
                </span>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2">
              {property.amenities?.slice(0, 3).map((amenity, index) => {
                const amenityText = getAmenityText(amenity);
                return (
                  <span
                    key={index}
                    className="px-3 py-1 bg-black/40 text-white text-xs rounded-full border border-white/20"
                  >
                    {amenityText}
                  </span>
                );
              })}
              {property.amenities && property.amenities.length > 3 && (
                <span className="px-3 py-1 bg-black/40 text-white text-xs rounded-full border border-white/20">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="space-y-4">
              {/* HHP Protocol Data */}
              {property.hhpData && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    HHP Protocol Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Builder:</span>
                      <p className="font-medium">
                        {property.hhpData?.builder?.slice(0, 6)}...
                        {property.hhpData?.builder?.slice(-4)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Max Guests:</span>
                      <p className="font-medium">
                        {property.hhpData?.maxGuests || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Proof Required:</span>
                      <p className="font-medium">
                        {property.hhpData?.requireProof ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Block:</span>
                      <p className="font-medium">
                        {property.hhpData?.blockNumber || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* IPFS Metadata */}
              {property.metadata && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                    <Info className="w-4 h-4 text-green-600" />
                    Property Details
                  </h4>
                  {property.metadata.description && (
                    <p className="text-sm text-gray-600">
                      {property.metadata.description}
                    </p>
                  )}
                  {property.metadata?.amenities &&
                    property.metadata.amenities.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600">
                          Amenities:
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {property.metadata.amenities.map(
                            (amenity: any, index: number) => {
                              const amenityText = getAmenityText(amenity);
                              return (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {amenityText}
                                </Badge>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button asChild className="flex-1" size="sm">
                  <Link href={`/property/${property.id}`}>View Details</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleFavoriteClick}
                >
                  {favorite ? "Remove from Favorites" : "Add to Favorites"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
