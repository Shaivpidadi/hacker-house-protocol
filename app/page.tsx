"use client";

import {
  Search,
  Menu,
  Heart,
  Info,
  MapPin,
  Users,
  Home,
  Compass,
  Calendar,
  User,
  Star,
  Wifi,
  Car,
  AlarmSmokeIcon as Smoke,
  Bath,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { BottomNavigation } from "@/components/bottom-navigation";

export default function HomePage() {
  const { user, authenticated, ready } = usePrivy();

  const hackerHouses = [
    {
      id: 1,
      title: "TechBros BA",
      location: "Buenos Aires",
      description: "Just cool people getting together to make cool stuff.",
      attendees: 6,
    },
    {
      id: 2,
      title: "TechBros BA",
      location: "Buenos Aires",
      description: "Just cool people getting together to make cool stuff.",
      attendees: 8,
    },
  ];

  const properties = [
    {
      id: 1,
      title: "Room in Palermo",
      location: "ETH Global Buenos Aires",
      price: 89,
      rating: 4.85,
      image: "/property-palermo-1.png",
      amenities: [
        { name: "Free Wifi", icon: Wifi },
        { name: "Free parking", icon: Car },
        { name: "Non-smoking", icon: Smoke },
        { name: "Hot Tub", icon: Bath },
      ],
    },
    {
      id: 2,
      title: "Room in Palermo",
      location: "ETH Global Buenos Aires",
      price: 89,
      rating: 4.85,
      image: "/property-palermo-2.png",
      amenities: [
        { name: "Self check-in", icon: Home },
        { name: "Outdoor entertainment", icon: Users },
      ],
    },
    {
      id: 3,
      title: "Room in Palermo",
      location: "ETH Global Buenos Aires",
      price: 89,
      rating: 4.85,
      image: "/property-palermo-3.png",
      amenities: [
        { name: "Guest favourite", icon: Heart },
        { name: "5 Minutes Walk from Hackathon", icon: MapPin },
      ],
    },
  ];

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
                {user.email?.address?.split("@")[0] ||
                  user.wallet?.address?.slice(0, 6) ||
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
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded shadow-sm"></div>
              </div>
              <span className="text-sm font-medium text-black border-b-2 border-blue-600 pb-1">
                Apartments
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded shadow-sm"></div>
              </div>
              <span className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                Events
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 pb-24">
        <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Explore Hackathon Events!
        </h1>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Hacker Houses</h2>
          <Button
            variant="ghost"
            className="text-blue-500 font-medium hover:text-blue-600 transition-colors"
          >
            View All
          </Button>
        </div>

        <div className="space-y-4 mb-8">
          {hackerHouses.map((house) => (
            <Card
              key={house.id}
              className="rounded-2xl shadow-sm bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex-shrink-0 shadow-sm"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">
                      {house.title}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {house.location}
                      </span>
                      <Users className="w-3 h-3 text-gray-400 ml-2" />
                      <span className="text-sm text-gray-500">
                        {house.attendees} members
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {house.description}
                    </p>
                    <Button className="bg-white border border-gray-300 text-black hover:bg-gray-50 rounded-full px-6 h-8 text-sm transition-all duration-200 hover:scale-105">
                      Join
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Property Cards */}
        <div className="space-y-4 mb-8">
          {properties.map((property) => (
            <Link key={property.id} href={`/property/${property.id}`}>
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
                      {property.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 px-3 py-1 bg-black/30 rounded-full text-xs backdrop-blur-sm"
                        >
                          <amenity.icon className="w-3 h-3" />
                          <span>{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

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
