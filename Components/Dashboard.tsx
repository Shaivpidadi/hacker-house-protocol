"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { useProperties, useBookings, useHackers, useLandlords, useReviews, useEvents } from '@/lib/hooks';
import { useSeedDatabase } from '@/lib/seed-data';
import { Property, Booking, Review } from '@/app/schema';

export default function HackerhouseDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [isSeeded, setIsSeeded] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)
  
  // Hypergraph data hooks
  const seedDatabase = useSeedDatabase();
  const { data: properties } = useProperties();
  const { data: bookings } = useBookings();
  const { data: hackers } = useHackers();
  const { data: landlords } = useLandlords();
  const { data: reviews } = useReviews();
  const { data: events } = useEvents();

  // Auto-seed on component mount
  useEffect(() => {
    const autoSeed = async () => {
      if (!isSeeded && !isSeeding) {
        setIsSeeding(true);
        try {
          await seedDatabase();
          setIsSeeded(true);
        } catch (error) {
          console.error('Auto-seeding failed:', error);
        } finally {
          setIsSeeding(false);
        }
      }
    };
    
    autoSeed();
  }, [isSeeded, isSeeding, seedDatabase]);

  // Calculate real stats from Hypergraph data
  const stats = {
    totalProperties: properties?.length || 0,
    activeBookings: bookings?.filter((b: Booking) => b.status === 'confirmed' || b.status === 'pending').length || 0,
    totalHackers: hackers?.length || 0,
    totalRevenue: bookings?.reduce((acc: number, booking: Booking) => acc + booking.totalPrice, 0) || 0,
    averageRating: reviews?.length ? 
      reviews.reduce((acc: number, review: Review) => acc + review.rating, 0) / reviews.length : 0,
    totalEvents: events?.length || 0,
    totalReviews: reviews?.length || 0,
    totalLandlords: landlords?.length || 0,
  }

  // Generate recent activity from real data
  const recentActivity = [
    ...(bookings?.slice(0, 3).map((booking: Booking, index: number) => ({
      id: index + 1,
      action: "New booking",
      property: booking.property?.[0]?.name || "Unknown Property",
      user: booking.hackers?.[0]?.name || "Unknown Hacker",
      time: "2 min ago",
      status: booking.status,
    })) || []),
    ...(properties?.slice(0, 2).map((property: Property, index: number) => ({
      id: index + 4,
      action: "Property listed",
      property: property.name,
      user: "Landlord",
      time: "15 min ago",
      status: property.status,
    })) || [])
  ].slice(0, 4);

  // Generate property status data for charts
  const propertyStatusData = [
    { name: "Available", value: properties?.filter((p: Property) => p.status === 'available').length || 0, color: "#8b5cf6" },
    { name: "Booked", value: properties?.filter((p: Property) => p.status === 'booked').length || 0, color: "#a855f7" },
    { name: "Maintenance", value: properties?.filter((p: Property) => p.status === 'maintenance').length || 0, color: "#c084fc" },
  ].filter(item => item.value > 0);

  // Generate booking status data for charts
  const bookingStatusData = [
    { name: "Confirmed", value: bookings?.filter((b: Booking) => b.status === 'confirmed').length || 0, color: "#8b5cf6" },
    { name: "Completed", value: bookings?.filter((b: Booking) => b.status === 'completed').length || 0, color: "#a855f7" },
    { name: "Pending", value: bookings?.filter((b: Booking) => b.status === 'pending').length || 0, color: "#c084fc" },
    { name: "Cancelled", value: bookings?.filter((b: Booking) => b.status === 'cancelled').length || 0, color: "#fbcfe8" },
  ].filter(item => item.value > 0);

  useEffect(() => {
    // Show loading until data is seeded and loaded
    if (isSeeded && !isSeeding) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isSeeded, isSeeding])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-chart-1"
      case "completed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      case "active":
        return "bg-chart-2"
      case "available":
        return "bg-chart-1"
      case "booked":
        return "bg-chart-2"
      case "maintenance":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading || isSeeding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">
            {isSeeding ? "Seeding Hypergraph database..." : "Loading data..."}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {isSeeding ? "Creating mock data for Hackerhouse Protocol" : "Initializing Hackerhouse Protocol"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="glass rounded-lg p-6 glow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Hackerhouse Protocol
              </h1>
              <p className="text-muted-foreground mt-1">Buenos Aires Ethereum Hackathon Dashboard</p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Live Data</span>
              </div>
              <Badge variant="secondary" className="glow">
                🏠 {stats.totalProperties} Properties
              </Badge>
              {isSeeded && (
                <Badge variant="outline" className="text-green-500">
                  ✓ Seeded
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass mb-6 p-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="properties"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
          >
            Properties
          </TabsTrigger>
          <TabsTrigger
            value="bookings"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
          >
            Bookings
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass glass-hover glow-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏠</span>
                  <span className="text-2xl font-bold">{stats.totalProperties}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass glass-hover glow-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📅</span>
                  <span className="text-2xl font-bold">{stats.activeBookings}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass glass-hover glow-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Hackers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👨‍💻</span>
                  <span className="text-2xl font-bold">{stats.totalHackers}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass glass-hover glow-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  <span className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass glass-hover glow-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass glass-hover glow-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎉</span>
                  <span className="text-2xl font-bold">{stats.totalEvents}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass glass-hover glow-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  <span className="text-2xl font-bold">{stats.totalReviews}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass glass-hover glow-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Landlords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏘️</span>
                  <span className="text-2xl font-bold">{stats.totalLandlords}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="glass glow">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from the Hackerhouse Protocol</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg glass-hover">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(activity.status)}`}></div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.property} • {activity.user}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties?.slice(0, 12).map((property: Property, index: number) => (
              <Card key={`${property.name}-${index}`} className="glass glass-hover glow-hover overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={property.image?.[0]?.url || "/placeholder.svg"}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className={`absolute top-2 right-2 ${getStatusColor(property.status)} text-white`}>
                    {property.status}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{property.name}</CardTitle>
                  <CardDescription>{property.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-secondary">${property.price}/night</span>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>🛏️ {property.bedrooms}</span>
                      <span>🚿 {property.bathrooms}</span>
                    </div>
                  </div>
                  <Button className="w-full" variant={property.status === "available" ? "default" : "secondary"}>
                    {property.status === "available" ? "Book Now" : "View Details"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <Card className="glass glow">
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Manage all property bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2">Property</th>
                      <th className="text-left p-2">Check-in</th>
                      <th className="text-left p-2">Check-out</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings?.slice(0, 10).map((booking: Booking, index: number) => (
                      <tr key={`${booking.checkIn}-${booking.checkOut}-${index}`} className="border-b border-border hover:bg-card/50">
                        <td className="p-2 font-medium">{booking.property?.[0]?.name || 'N/A'}</td>
                        <td className="p-2 text-muted-foreground">{booking.checkIn}</td>
                        <td className="p-2 text-muted-foreground">{booking.checkOut}</td>
                        <td className="p-2">
                          <Badge className={`${getStatusColor(booking.status)} text-white`}>{booking.status}</Badge>
                        </td>
                        <td className="p-2 font-medium">${booking.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass glow">
              <CardHeader>
                <CardTitle>Property Status Distribution</CardTitle>
                <CardDescription>Current status of all properties</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={propertyStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {propertyStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass glow">
              <CardHeader>
                <CardTitle>Booking Status Distribution</CardTitle>
                <CardDescription>Overview of booking statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bookingStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#ffffff" />
                    <YAxis stroke="#ffffff" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}