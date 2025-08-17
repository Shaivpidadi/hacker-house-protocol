"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { useHypergraphAuth } from '@graphprotocol/hypergraph-react';

import {
  useDashboardStats, 
  useRecentActivity, 
  useDashboardProperties, 
  useDashboardBookings,
  usePropertyStatusData,
  useBookingStatusData
} from "@/lib/queries"
import { useSeedPrivateDatabase } from "@/lib/seed-data"
import { usePublishToPublicSpace } from "@/lib/publish-to-public"

// component to show authentication required
function AuthenticationRequired() {
  const { authenticated, identity } = useHypergraphAuth();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>
            You need to authenticate with Hypergraph to seed data to your private space.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Current Status:</p>
            <p>Authenticated: {authenticated ? '✅ Yes' : '❌ No'}</p>
            {identity && (
              <p>Identity: {String(identity)}</p>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">To authenticate:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open Hypergraph Geo Connect</li>
              <li>Sign in with your wallet</li>
              <li>Refresh this page</li>
            </ol>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full"
          >
            Refresh Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// component to show when no private spaces are available
function NoPrivateSpace() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>No Private Space Available</CardTitle>
          <CardDescription>
            A private space is required to seed the database. Please create a private space using the Hypergraph CLI or Geo Connect.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">To create a private space:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open Hypergraph Geo Connect</li>
              <li>Create a new private space</li>
              <li>Refresh this page</li>
            </ol>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full"
          >
            Refresh Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function HackerhouseDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSeeding, setIsSeeding] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // check authentication status
  const { authenticated, identity } = useHypergraphAuth();

  // fetch real data from hypergraph
  const stats = useDashboardStats();
  const recentActivity = useRecentActivity();
  const properties = useDashboardProperties();
  const bookings = useDashboardBookings();
  const propertyStatusData = usePropertyStatusData();
  const bookingStatusData = useBookingStatusData();

  // get the seeding and publishing functions
  const seedDatabase = useSeedPrivateDatabase();
  const publishToPublicSpace = usePublishToPublicSpace();

  useEffect(() => {
    // if not authenticated, don't proceed with seeding
    if (!authenticated) {
      setIsLoading(false);
      return;
    }

    // check if all data is loaded
    const allDataLoaded = !stats.loading && !recentActivity.loading &&
                           !properties.loading && !bookings.loading &&
                           !propertyStatusData.loading && !bookingStatusData.loading;

    if (allDataLoaded) {
      // check if we have any data
      const hasData = stats.data && (
        stats.data.totalProperties > 0 ||
        stats.data.totalHackers > 0 ||
        stats.data.totalLandlords > 0
      );

      if (!hasData && !isSeeding) {
        // no data found, automatically seed the database and publish to public
        setIsSeeding(true);
        
        // first seed the private database
        seedDatabase()
          .then((result) => {
            if (result.success) {
              console.log('✅ private database seeded successfully');
              
              // then publish to public space (if public space ID is available)
              const publicSpaceId = process.env.NEXT_PUBLIC_HYPERGRAPH_PUBLIC_SPACE_ID;
              if (publicSpaceId) {
                console.log('🚀 publishing to public space...');
                return publishToPublicSpace(publicSpaceId);
              } else {
                console.log('⚠️ no public space ID found, skipping public publishing');
                return { success: true };
              }
            } else {
              console.error('❌ private database seeding failed:', result);
              throw new Error('Private seeding failed');
            }
          })
          .then((publishResult) => {
            if (publishResult.success) {
              console.log('✅ successfully published to public space');
            } else {
              console.warn('⚠️ public publishing failed:', publishResult);
            }
            
            // wait a bit for the data to be available, then refresh
            setTimeout(() => {
              setIsLoading(false);
              setIsSeeding(false);
            }, 2000);
          })
          .catch((error) => {
            console.error('❌ database seeding/publishing error:', error);
            setIsLoading(false);
            setIsSeeding(false);
          });
      } else if (hasData) {
        // data exists, show the dashboard
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [authenticated, stats.loading, recentActivity.loading, properties.loading, bookings.loading, propertyStatusData.loading, bookingStatusData.loading, stats.data, isSeeding, seedDatabase, publishToPublicSpace]);

  // if not authenticated, show authentication required screen
  if (!authenticated) {
    return <AuthenticationRequired />;
  }

  // loading state
  if (isLoading || isSeeding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">
            {isSeeding ? 'setting up hypergraph database...' : 'loading hypergraph data...'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {isSeeding ? 'creating and publishing data to spaces' : 'fetching real-time dashboard metrics'}
          </p>
        </div>
      </div>
    );
  }

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

  // Use real data or fallback to 0 if data is not available
  const statsData = stats.data || {
    totalProperties: 0,
    activeBookings: 0,
    totalHackers: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalEvents: 0,
    totalReviews: 0,
    totalLandlords: 0
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
                🏠 {statsData.totalProperties} Properties
              </Badge>
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
                  <span className="text-2xl font-bold">{statsData.totalProperties}</span>
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
                  <span className="text-2xl font-bold">{statsData.activeBookings}</span>
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
                  <span className="text-2xl font-bold">{statsData.totalHackers}</span>
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
                  <span className="text-2xl font-bold">${statsData.totalRevenue.toLocaleString()}</span>
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
                  <span className="text-2xl font-bold">{statsData.averageRating}</span>
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
                  <span className="text-2xl font-bold">{statsData.totalEvents}</span>
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
                  <span className="text-2xl font-bold">{statsData.totalReviews}</span>
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
                  <span className="text-2xl font-bold">{statsData.totalLandlords}</span>
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
                {recentActivity.data.length > 0 ? (
                  recentActivity.data.map((activity) => (
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
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.data.length > 0 ? (
              properties.data.map((property) => (
                <Card key={property.id} className="glass glass-hover glow-hover overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={property.image}
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
              ))
            ) : (
              <p className="text-muted-foreground text-center col-span-full py-8">No properties found</p>
            )}
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
                {bookings.data.length > 0 ? (
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
                      {bookings.data.map((booking) => (
                        <tr key={booking.id} className="border-b border-border hover:bg-card/50">
                          <td className="p-2 font-medium">{booking.property}</td>
                          <td className="p-2 text-muted-foreground">{booking.checkIn}</td>
                          <td className="p-2 text-muted-foreground">{booking.checkOut}</td>
                          <td className="p-2">
                            <Badge className={`${getStatusColor(booking.status)} text-white`}>{booking.status}</Badge>
                          </td>
                          <td className="p-2 font-medium">${booking.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No bookings found</p>
                )}
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
                {propertyStatusData.data.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={propertyStatusData.data}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {propertyStatusData.data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No property data available</p>
                )}
              </CardContent>
            </Card>

            <Card className="glass glow">
              <CardHeader>
                <CardTitle>Booking Status Distribution</CardTitle>
                <CardDescription>Overview of booking statuses</CardDescription>
              </CardHeader>
              <CardContent>
                {bookingStatusData.data.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bookingStatusData.data}>
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
                ) : (
                  <p className="text-muted-foreground text-center py-8">No booking data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

