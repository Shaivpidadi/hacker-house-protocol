"use client";

import { useFavorites } from "@/hooks/use-favorites";
import { PropertyCard } from "@/components/explore/property-card";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites, isLoaded, clearFavorites } = useFavorites();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/explore">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">My Favorites</h1>
                <p className="text-sm text-gray-600">
                  {favorites.length} saved property
                  {favorites.length !== 1 ? "ies" : "y"}
                </p>
              </div>
            </div>
            {favorites.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFavorites}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 pb-24">
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start exploring properties and add them to your favorites!
            </p>
            <Button asChild>
              <Link href="/explore">Explore Properties</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            {favorites.map((favorite) => (
              <PropertyCard
                key={favorite.id}
                property={{
                  ...favorite,
                  isFavorite: true, // Force to show as favorite
                }}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNavigation activeTab="Favorites" />
    </div>
  );
}
