"use client"

import { useState } from "react"
import { Search, Menu, Calendar, Users, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BottomNavigation } from "@/components/bottom-navigation"
import { PropertyCard } from "@/components/explore/property-card"

export function Explore() {
  const [activeTab, setActiveTab] = useState("Apartments")

  const properties = [
    {
      id: 1,
      title: "Room in Palermo",
      location: "ETH Global Buenos Aires",
      price: 89,
      rating: 4.85,
      image: "/property-palermo-1.png",
      amenities: ["Self check-in", "Outdoor entertainment"],
      isFavorite: false,
    },
    {
      id: 2,
      title: "Room in Palermo",
      location: "ETH Global Buenos Aires",
      price: 89,
      rating: 4.85,
      image: "/property-palermo-2.png",
      amenities: ["Free Wifi", "Free parking", "Non-smoking", "Hot Tub"],
      isFavorite: false,
    },
    {
      id: 3,
      title: "Room in Palermo",
      location: "ETH Global Buenos Aires",
      price: 89,
      rating: 4.85,
      image: "/property-palermo-3.png",
      amenities: ["Guest favourite", "5 Minutes Walk from Hackathon"],
      isFavorite: false,
    },
    {
      id: 4,
      title: "Room in Palermo",
      location: "ETH Global Buenos Aires",
      price: 89,
      rating: 4.85,
      image: "/property-palermo-4.png",
      amenities: ["Shared Apartment", "Kitchen", "Private Room"],
      isFavorite: false,
    },
  ]

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
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search" className="pl-10 bg-gray-100 border-none rounded-xl h-12" />
            </div>
            <Button variant="outline" size="icon" className="w-12 h-12 rounded-xl border-2 border-black bg-transparent">
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
                  activeTab === "Apartments" ? "text-black border-b-2 border-black pb-1" : "text-gray-500"
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
                  activeTab === "Events" ? "text-black border-b-2 border-black pb-1" : "text-gray-500"
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
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
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
                    <h3 className="text-white font-bold text-lg mb-1">{event.title}</h3>
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
  )
}
