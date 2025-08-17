"use client"

import { Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BottomNavigation } from "@/components/bottom-navigation"

export function MapView() {
  const mapMarkers = [
    { id: 1, x: 60, y: 40, type: "blue", size: "large" },
    { id: 2, x: 45, y: 55, type: "blue", size: "medium" },
    { id: 3, x: 70, y: 70, type: "blue", size: "small" },
    { id: 4, x: 30, y: 80, type: "blue", size: "medium" },
    { id: 5, x: 80, y: 45, type: "green", size: "small" },
    { id: 6, x: 85, y: 65, type: "green", size: "medium" },
    { id: 7, x: 75, y: 85, type: "green", size: "large" },
    { id: 8, x: 90, y: 75, type: "green", size: "small" },
    { id: 9, x: 95, y: 55, type: "green", size: "medium" },
  ]

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      {/* Header */}
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
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded"></div>
            </div>
            <span className="text-sm font-medium text-black border-b-2 border-black pb-1">Apartments</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-orange-500 rounded"></div>
            </div>
            <span className="text-sm font-medium text-gray-500">Events</span>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-gray-100 mx-4 rounded-2xl mb-4 overflow-hidden" style={{ height: "500px" }}>
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="text-gray-300">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Map Markers */}
        {mapMarkers.map((marker) => (
          <div
            key={marker.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg ${
              marker.type === "blue" ? "bg-blue-500" : "bg-green-500"
            } ${marker.size === "large" ? "w-12 h-12" : marker.size === "medium" ? "w-8 h-8" : "w-6 h-6"}`}
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
            }}
          />
        ))}

        {/* Property Info Card */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">Room in Palermo</h3>
              <div className="flex items-center gap-2">
                <Button size="sm" className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 p-0">
                  <span className="text-white text-xs">♥</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-8 h-8 rounded-full border-2 border-black p-0 bg-transparent"
                >
                  <span className="text-black text-xs">i</span>
                </Button>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-2">© ETH Global Buenos Aires</p>
            <div className="flex items-center gap-4">
              <span className="font-semibold">$89/Day</span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-medium">4.85</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation activeTab="Explore" />
    </div>
  )
}
