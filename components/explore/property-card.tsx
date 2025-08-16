"use client"

import { useState } from "react"
import { Heart, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface Property {
  id: number
  title: string
  location: string
  price: number
  rating: number
  image: string
  amenities: string[]
  isFavorite: boolean
}

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(property.isFavorite)

  return (
    <Link href={`/property/${property.id}`}>
      <Card className="rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          {/* Property Image */}
          <div className="relative h-48 bg-gradient-to-br from-gray-400 to-gray-700">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="sm"
                className={`w-10 h-10 rounded-full p-0 ${
                  isFavorite ? "bg-green-500 hover:bg-green-600" : "bg-white/80 hover:bg-white"
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  setIsFavorite(!isFavorite)
                }}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "text-white fill-white" : "text-gray-600"}`} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-10 h-10 rounded-full border-2 border-white bg-white/80 p-0"
                onClick={(e) => e.preventDefault()}
              >
                <Info className="w-5 h-5 text-black" />
              </Button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg text-white">{property.title}</h3>
                  <p className="text-gray-200 text-sm">© {property.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <span className="font-semibold text-white">${property.price}/Day</span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-medium text-white">{property.rating}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-black/40 text-white text-xs rounded-full border border-white/20"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
