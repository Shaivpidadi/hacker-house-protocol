"use client"

import { Calendar, Clock, Users, MapPin, Star, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/bottom-navigation"
import Link from "next/link"

export default function HackstayPage() {
  const upcomingStays = [
    {
      id: 1,
      title: "ETH Global Buenos Aires",
      location: "Palermo, Buenos Aires",
      dates: "Aug 15-17, 2025",
      status: "Confirmed",
      guests: 3,
      image: "/property-palermo-1.png",
    },
  ]

  const pastStays = [
    {
      id: 2,
      title: "ETH Berlin Hackathon",
      location: "Berlin, Germany",
      dates: "Jul 10-12, 2025",
      status: "Completed",
      rating: 4.8,
      image: "/property-palermo-2.png",
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="glass-card border-b border-border sticky top-0 z-10">
        <div className="max-w-md mx-auto p-4">
          <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">Your Hackstays</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your hackathon accommodations</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Upcoming Stays */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Upcoming Stays</h2>
            <Link href="/explore">
              <Button size="sm" className="gradient-primary text-primary-foreground rounded-full glass">
                <Plus className="w-4 h-4 mr-1" />
                Book New
              </Button>
            </Link>
          </div>

          {upcomingStays.length === 0 ? (
            <div className="text-center py-8 glass-card rounded-lg shadow-sm">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No upcoming stays</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingStays.map((stay) => (
                <div
                  key={stay.id}
                  className="glass-card rounded-lg shadow-lg p-4 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 gradient-primary rounded-lg glass"></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{stay.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        {stay.location}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3" />
                        {stay.dates}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Users className="w-3 h-3" />
                        {stay.guests} guests
                      </div>
                      <div className="mt-2">
                        <span className="px-2 py-1 bg-chart-3/20 text-chart-3 text-xs rounded-full font-medium">
                          {stay.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Stays */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Past Stays</h2>

          {pastStays.length === 0 ? (
            <div className="text-center py-8 glass-card rounded-lg shadow-sm">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No past stays</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pastStays.map((stay) => (
                <div
                  key={stay.id}
                  className="glass-card rounded-lg shadow-lg p-4 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 gradient-secondary rounded-lg glass"></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{stay.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        {stay.location}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3" />
                        {stay.dates}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full font-medium">
                          {stay.status}
                        </span>
                        {stay.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-chart-2 text-chart-2" />
                            <span className="text-sm font-medium text-foreground">{stay.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation activeTab="Hackstay" />
    </div>
  )
}
