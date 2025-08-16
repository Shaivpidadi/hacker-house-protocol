"use client"

import { Heart, Star, MapPin, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/bottom-navigation"
import Link from "next/link"
import { useState } from "react"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      title: "Room in Palermo",
      location: "ETH Global Buenos Aires",
      price: "$89/Day",
      rating: 4.85,
      image: "/property-palermo-1.png",
      savedDate: "2 days ago",
    },
    {
      id: 2,
      title: "Hacker House Berlin",
      location: "ETH Berlin Hackathon",
      price: "$65/Day",
      rating: 4.92,
      image: "/property-palermo-2.png",
      savedDate: "1 week ago",
    },
  ])

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((fav) => fav.id !== id))
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="glass-card border-b border-border sticky top-0 z-10">
        <div className="max-w-md mx-auto p-4">
          <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">Your Favorites</h1>
          <p className="text-muted-foreground text-sm mt-1">{favorites.length} saved properties</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6">Start exploring and save properties you love!</p>
            <Link href="/explore">
              <Button className="gradient-primary text-primary-foreground rounded-full px-8 glass">
                Explore Properties
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((property) => (
              <div
                key={property.id}
                className="glass-card rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="flex">
                  <div className="w-24 h-24 gradient-secondary relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-foreground">{property.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" />
                          {property.location}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="font-bold text-primary">{property.price}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-chart-2 text-chart-2" />
                            <span className="text-sm text-foreground">{property.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Saved {property.savedDate}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFavorite(property.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation activeTab="Favorites" />
    </div>
  )
}
