"use client";

import { useState } from "react";
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
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PropertyDetailProps {
  propertyId: string;
}

export function PropertyDetail({ propertyId }: PropertyDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const property = {
    id: propertyId,
    title: "ETH Global Buenos Aires - Private room Palermo",
    rating: 4.95,
    reviewCount: 22,
    location: "Palermo, Buenos Aires",
    host: "LLC Real Estate",
    price: 440,
    originalPrice: 500,
    image: "/property-detail-hero.jpg",
  };

  const amenities = [
    { icon: Bed, label: "1 guest bed" },
    { icon: Bath, label: "Shared bathroom" },
    { icon: Users, label: "Other guests may be here" },
  ];

  const features = [
    {
      icon: Home,
      label: "Room in a rental unit",
      description: "Your own room in a home, plus access to shared spaces.",
    },
    {
      icon: Briefcase,
      label: "Dedicated workspace",
      description: "A room with wifi that's well-suited for working.",
    },
    {
      icon: MapPin,
      label: "5 Minute Walk from Hackathon",
      description: "Accessible travel and public transportation.",
    },
    { icon: Clock, label: "Free cancellation for 48 hours", description: "" },
  ];

  const reviews = [
    {
      id: 1,
      user: "Emma",
      timeAgo: "3 weeks ago",
      text: "We were only sad not to stay longer. We hope to be back to explore Nantes some more and would love to stay at Glowerin's pla...",
      avatar: "/avatar-emma.png",
    },
    {
      id: 2,
      user: "Dorothy",
      timeAgo: "2 weeks ago",
      text: "While for on Devon! This ur",
      avatar: "/avatar-dorothy.png",
    },
  ];

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <Link href="/explore">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 text-center">
          <h1 className="font-semibold text-base truncate px-4">
            {property.title}
          </h1>
          <p className="text-xs text-gray-500">August 15-17</p>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 bg-gradient-to-br from-gray-400 to-gray-600">
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="sm"
            className={`w-10 h-10 rounded-full p-0 ${
              isFavorite
                ? "bg-green-500 hover:bg-green-600"
                : "bg-white/80 hover:bg-white"
            }`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? "text-white fill-white" : "text-gray-600"
              }`}
            />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 rounded-full border-2 border-white bg-white/80 p-0"
          >
            <Info className="w-5 h-5 text-black" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-24">
        {/* Property Header */}
        <div className="py-6 border-b border-gray-100">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">{property.title}</h2>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 fill-black text-black" />
                <span className="font-medium">{property.rating}</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">
                  {property.reviewCount} reviews
                </span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">{property.host}</span>
                <span className="text-blue-500 text-sm">3D Tour</span>
              </div>
              <p className="text-gray-600">{property.location}</p>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
          </div>
        </div>

        {/* Room Description */}
        <div className="py-6 border-b border-gray-100">
          <h3 className="font-semibold mb-4">
            Room in a rental unit hosted by {property.host}
          </h3>

          <div className="flex items-center gap-6 mb-4">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <amenity.icon className="w-6 h-6 mb-1" />
                <span className="text-xs text-gray-600">{amenity.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="py-6 border-b border-gray-100">
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <feature.icon className="w-6 h-6 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{feature.label}</h4>
                  {feature.description && (
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="py-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Address</h3>
            <Button variant="ghost" className="text-blue-500 font-medium p-0">
              View on Map
            </Button>
          </div>
          <p className="text-gray-600 mb-4">Lorem ipsum is simply dummy text</p>

          {/* Mini Map */}
          <div className="h-32 bg-gray-100 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium">
              UNION
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="py-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 fill-black text-black" />
            <span className="font-semibold text-lg">{property.rating}</span>
            <span className="text-gray-500">·</span>
            <span className="font-semibold">
              {property.reviewCount} reviews
            </span>
          </div>

          <div className="space-y-4 mb-4">
            {reviews.map((review) => (
              <div key={review.id} className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{review.user}</span>
                    <span className="text-gray-500 text-sm">
                      {review.timeAgo}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{review.text}</p>
                  <Button
                    variant="ghost"
                    className="text-blue-500 p-0 h-auto text-sm mt-1"
                  >
                    Show more
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full h-12 rounded-xl border-gray-300 bg-transparent"
          >
            Show all {property.reviewCount} reviews
          </Button>
        </div>

        {/* Cancellation Policy */}
        <div className="py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Cancellation policy</h3>
              <p className="text-sm text-gray-600">
                Free cancellation for 48 hours.
              </p>
              <p className="text-sm text-gray-600">
                Review the Host's full cancellation policy
              </p>
              <p className="text-sm text-gray-600">
                which applies even if you cancel for illness
              </p>
              <p className="text-sm text-gray-600">
                or disruptions caused by COVID-19.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* House Rules */}
        <div className="py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">House rules</h3>
              <p className="text-sm text-gray-600">
                Check-in: 6:00 PM - 11:00 PM
              </p>
              <p className="text-sm text-gray-600">Checkout: before 8:00 AM</p>
              <p className="text-sm text-gray-600">2 guests maximum</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <Button
            variant="ghost"
            className="text-blue-500 p-0 h-auto text-sm mt-2"
          >
            Show more
          </Button>
        </div>

        {/* Safety & Property */}
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Safety & property</h3>
              <p className="text-sm text-gray-600">No carbon monoxide alarm</p>
              <p className="text-sm text-gray-600">
                Security camera/recording device
              </p>
              <p className="text-sm text-gray-600">Smoke alarm</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <Button
            variant="ghost"
            className="text-blue-500 p-0 h-auto text-sm mt-2"
          >
            Show more
          </Button>
        </div>
      </div>

      {/* Bottom Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                ${property.price}/night
                <span className="text-xs font-normal text-gray-500 ml-1">
                  pyUSD
                </span>
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${property.originalPrice}
                <span className="text-xs font-normal text-gray-500 ml-1">
                  pyUSD
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-black text-black" />
              <span className="text-sm font-medium">
                {property.rating} · {property.reviewCount} reviews
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-xl border-gray-300 bg-transparent"
          >
            Invite Friends to Hack
          </Button>
          <Link href={`/booking/${propertyId}`} className="flex-1">
            <Button className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white rounded-xl">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
