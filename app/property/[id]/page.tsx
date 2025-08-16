"use client"

import { ArrowLeft, Heart, Info, Star, MapPin, Users, Bed, Bath, Home, Briefcase, Clock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative">
        <div className="h-64 gradient-secondary">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-4 left-4">
            <Link href="/">
              <Button size="icon" variant="secondary" className="w-10 h-10 rounded-full glass-card">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button size="icon" variant="secondary" className="w-10 h-10 rounded-full glass-card">
              <Heart className="w-5 h-5 text-chart-3" />
            </Button>
            <Button size="icon" variant="secondary" className="w-10 h-10 rounded-full glass-card">
              <Info className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Property Info */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 text-foreground">ETH Global Buenos Aires - Private room Palermo</h1>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 fill-current text-chart-2" />
            <span className="font-medium text-foreground">4.95</span>
            <span className="text-muted-foreground">• 22 reviews</span>
            <span className="text-muted-foreground">• LLC Real Estate</span>
            <span className="text-accent text-sm">3D Tour</span>
          </div>
          <p className="text-muted-foreground">Palermo, Buenos Aires</p>
        </div>

        {/* Room Details */}
        <Card className="mb-6 glass-card">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 text-foreground">Room in a rental unit hosted by LLC Real Estate</h3>
            <div className="flex justify-between">
              <div className="flex flex-col items-center">
                <Bed className="w-6 h-6 mb-1 text-primary" />
                <span className="text-xs text-muted-foreground">1 guest bed</span>
              </div>
              <div className="flex flex-col items-center">
                <Bath className="w-6 h-6 mb-1 text-primary" />
                <span className="text-xs text-muted-foreground">Shared bathroom</span>
              </div>
              <div className="flex flex-col items-center">
                <Users className="w-6 h-6 mb-1 text-primary" />
                <span className="text-xs text-muted-foreground">Other guests may be here</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <div className="mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Room in a rental unit</p>
                <p className="text-sm text-muted-foreground">Your own room in a home, plus access to shared spaces.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Dedicated workspace</p>
                <p className="text-sm text-muted-foreground">A room with wifi that's well-suited for working.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">5 Minute Walk from Hackathon</p>
                <p className="text-sm text-muted-foreground">Accessible travel and public transportation.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <p className="font-medium text-foreground">Free cancellation for 48 hours.</p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-foreground">Address</h3>
          <p className="text-muted-foreground mb-3">Lorem ipsum is simply dummy text</p>
          <div className="h-32 bg-muted glass-card rounded-lg flex items-center justify-center">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 fill-current text-chart-2" />
            <span className="text-lg font-semibold text-foreground">4.95 • 22 reviews</span>
          </div>
          <div className="space-y-4 mb-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 gradient-primary rounded-full glass"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground">Emma</span>
                  <span className="text-sm text-muted-foreground">3 weeks ago</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  We were only sad not to stay longer. We hope to be back to explore Nantes some more and would love to
                  stay at Glowerin's pla...
                </p>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full glass-card border-border bg-transparent">
            Show all 22 reviews
          </Button>
        </div>
      </div>

      {/* Bottom Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-border p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-foreground">$89/night</p>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-current text-chart-2" />
              <span className="text-sm text-muted-foreground">4.95 • 22 reviews</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="glass-card border-border bg-transparent">
              Invite Friends to Hack
            </Button>
            <Link href={`/booking/${params.id}`}>
              <Button className="gradient-primary text-primary-foreground hover:opacity-90 glass">Book Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
