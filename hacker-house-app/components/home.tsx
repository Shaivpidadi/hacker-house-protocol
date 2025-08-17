"use client";

import { useState } from "react";
import {
  Search,
  Menu,
  MapPin,
  Users,
  Heart,
  Info,
  Zap,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNavigation } from "@/components/bottom-navigation";
import Link from "next/link";

export function Home() {
  const [activeTab, setActiveTab] = useState("Hacker Houses");

  const events = [
    {
      id: 1,
      title: "ETH Global Buenos Aires",
      location: "Buenos Aires, Argentina",
      description:
        "Build the future of Web3 with the best developers worldwide.",
      attendees: 250,
      date: "Aug 15-17, 2025",
      type: "Hackathon",
      prize: "50 ETH",
    },
    {
      id: 2,
      title: "DeFi Summit 2025",
      location: "São Paulo, Brazil",
      description: "Decentralized finance protocols and innovation showcase.",
      attendees: 180,
      date: "Sep 5-7, 2025",
      type: "Conference",
      prize: "25 ETH",
    },
  ];

  const hackerHouses = [
    {
      id: 1,
      title: "TechBros BA",
      location: "Buenos Aires",
      description: "Just cool people getting together to make cool stuff.",
      attendees: 6,
      image: "/modern-apartment-building.png",
    },
    {
      id: 2,
      title: "TechBros BA",
      location: "Buenos Aires",
      description: "Just cool people getting together to make cool stuff.",
      attendees: 8,
      image: "/modern-coworking-space.png",
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
      amenities: ["Free Wifi", "Free parking", "Non-smoking", "Hot Tub"],
    },
    {
      id: 2,
      title: "Room in Palermo",
      location: "ETH Global Buenos Aires",
      price: 89,
      rating: 4.85,
      image: "/property-palermo-2.png",
      amenities: ["Self check-in", "Outdoor entertainment"],
    },
    {
      id: 3,
      title: "Room in Palermo",
      location: "ETH Global Buenos Aires",
      price: 89,
      rating: 4.85,
      image: "/property-palermo-3.png",
      amenities: ["Guest favourite", "5 Minutes Walk from Hackathon"],
    },
  ];

  const categories = [
    { name: "Developers", active: true },
    { name: "Front-End", active: false },
    { name: "Back-end", active: false },
    { name: "Full-Stack", active: false },
  ];

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      {/* Header */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search events & spaces..."
              className="pl-10 bg-input glass-card border-border rounded-lg h-12 shadow-sm focus:ring-2 focus:ring-ring transition-all duration-200"
            />
          </div>
          <Link href="/explore">
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-lg border-border glass-card hover:bg-muted transition-all duration-200 bg-transparent"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center gap-8 mb-6">
          <button
            onClick={() => {
              console.log("Switching to Hacker Houses tab");
              setActiveTab("Hacker Houses");
            }}
            className="flex flex-col items-center transition-all duration-300"
          >
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 transition-all duration-300 ${
                activeTab === "Hacker Houses"
                  ? "gradient-primary shadow-lg glass"
                  : "bg-muted glass-card"
              }`}
            >
              <div
                className={`w-6 h-6 rounded ${
                  activeTab === "Hacker Houses"
                    ? "bg-primary-foreground"
                    : "bg-primary"
                }`}
              ></div>
            </div>
            <span
              className={`text-sm font-medium transition-colors duration-300 ${
                activeTab === "Hacker Houses"
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-muted-foreground"
              }`}
            >
              Hacker Houses
            </span>
          </button>
          <button
            onClick={() => {
              console.log("Switching to Events tab");
              setActiveTab("Events");
            }}
            className="flex flex-col items-center transition-all duration-300"
          >
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 transition-all duration-300 ${
                activeTab === "Events"
                  ? "gradient-primary shadow-lg glass"
                  : "bg-muted glass-card"
              }`}
            >
              <Zap
                className={`w-6 h-6 ${
                  activeTab === "Events"
                    ? "text-primary-foreground"
                    : "text-primary"
                }`}
              />
            </div>
            <span
              className={`text-sm font-medium transition-colors duration-300 ${
                activeTab === "Events"
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-muted-foreground"
              }`}
            >
              Events
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-24">
        {/* Debug Info */}
        <div className="text-xs text-muted-foreground mb-2">
          Current tab: {activeTab} | Events count: {events.length}
        </div>

        <h1 className="text-2xl font-bold mb-6 gradient-primary bg-clip-text text-transparent">
          {activeTab === "Events"
            ? "Explore Hackathon Events!"
            : "Hacker Houses"}
        </h1>

        {activeTab === "Events" && (
          <div className="space-y-4 mb-8">
            <div className="text-xs text-muted-foreground mb-2">
              Rendering Events tab with {events.length} events
            </div>
            {events.map((event) => (
              <Card
                key={event.id}
                className="rounded-lg shadow-lg gradient-primary text-primary-foreground overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] glass"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4" />
                        <span className="text-xs font-medium bg-primary-foreground/20 px-2 py-1 rounded-full">
                          {event.type}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm opacity-90">
                          {event.location}
                        </span>
                      </div>
                      <p className="text-sm opacity-90 mb-3">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">{event.attendees}</span>
                          </div>
                          <span className="text-sm font-semibold">
                            {event.date}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs opacity-75">Prize Pool</div>
                          <div className="font-bold text-chart-2">
                            {event.prize}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-primary-foreground/30 rounded-lg glass transition-all duration-200">
                    Join Event
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "Hacker Houses" && (
          <>
            {/* Hacker Houses Section */}
            <div className="text-xs text-muted-foreground mb-2">
              Rendering Hacker Houses tab with {hackerHouses.length} houses
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Hacker Houses
              </h2>
              <Link href="/explore">
                <Button
                  variant="ghost"
                  className="text-primary font-medium hover:bg-muted transition-colors"
                >
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-4 mb-8">
              {hackerHouses.map((house) => (
                <Card
                  key={house.id}
                  className="rounded-lg shadow-sm glass-card hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 gradient-primary rounded-lg flex-shrink-0 glass"></div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base mb-1 text-foreground">
                          {house.title}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {house.location}
                          </span>
                          <Users className="w-3 h-3 text-muted-foreground ml-2" />
                          <span className="text-sm text-muted-foreground">
                            {house.attendees} members
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {house.description}
                        </p>
                        <Button className="gradient-primary text-primary-foreground hover:opacity-90 rounded-full px-6 h-8 text-sm shadow-md transition-all duration-200">
                          Join
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4 mb-8">
              {properties.map((property) => (
                <Link key={property.id} href={`/property/${property.id}`}>
                  <Card className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] glass-card">
                    <div className="relative h-48 gradient-secondary">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="w-10 h-10 rounded-full glass-card hover:bg-card shadow-lg transition-all duration-200"
                        >
                          <Heart className="w-5 h-5 text-chart-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="w-10 h-10 rounded-full glass-card hover:bg-card shadow-lg transition-all duration-200"
                        >
                          <Info className="w-5 h-5 text-foreground" />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-4 text-primary-foreground">
                        <h3 className="text-xl font-semibold mb-1">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{property.location}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-normal text-gray-500 mr-1">
                            pyUSD{" "}
                          </span>
                          <span className="text-lg font-semibold">
                            {property.price}/Day
                          </span>
                          <span className="text-sm">★ {property.rating}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {property.amenities
                            .slice(0, 2)
                            .map((amenity, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-primary-foreground/20 glass rounded-full text-xs border border-primary-foreground/30"
                              >
                                {amenity}
                              </span>
                            ))}
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
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          Find Hacker Homies
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={category.active ? "default" : "secondary"}
              className={`h-16 rounded-lg text-base font-medium transition-all duration-300 ${
                category.active
                  ? "gradient-secondary text-primary-foreground shadow-lg hover:opacity-90 glass"
                  : "glass-card text-foreground hover:bg-muted shadow-sm"
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
