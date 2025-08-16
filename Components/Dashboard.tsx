'use client';

import { useProperties, useBookings, useHackers, useLandlords, useReviews, useEvents } from '@/lib/hooks';
import { Property, Booking, Review } from '@/app/schema';
import { useState } from 'react';

export function Dashboard() {
  const { data: properties } = useProperties();
  const { data: bookings } = useBookings();
  const { data: hackers } = useHackers();
  const { data: landlords } = useLandlords();
  const { data: reviews } = useReviews();
  const { data: events } = useEvents();

  const [selectedView, setSelectedView] = useState<'overview' | 'properties' | 'bookings' | 'analytics'>('overview');

  const stats = {
    totalProperties: properties?.length || 0,
    totalBookings: bookings?.length || 0,
    totalHackers: hackers?.length || 0,
    totalLandlords: landlords?.length || 0,
    totalReviews: reviews?.length || 0,
    totalEvents: events?.length || 0,
    averageRating: reviews?.length ? 
      reviews.reduce((acc: number, review: Review) => acc + review.rating, 0) / reviews.length : 0,
    totalRevenue: bookings?.reduce((acc: number, booking: Booking) => acc + booking.totalPrice, 0) || 0
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Hackerhouse Dashboard</h1>
      
      {/* Navigation */}
      <div className="flex space-x-4 mb-6">
        {(['overview', 'properties', 'bookings', 'analytics'] as const).map((view) => (
          <button
            key={view}
            onClick={() => setSelectedView(view)}
            className={`px-4 py-2 rounded ${selectedView === view ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview */}
      {selectedView === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Properties</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalProperties}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Bookings</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalBookings}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Hackers</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalHackers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Landlords</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.totalLandlords}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Reviews</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.totalReviews}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Events</h3>
            <p className="text-3xl font-bold text-red-600">{stats.totalEvents}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Avg Rating</h3>
            <p className="text-3xl font-bold text-indigo-600">{stats.averageRating.toFixed(1)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Revenue</h3>
            <p className="text-3xl font-bold text-emerald-600">${stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Properties */}
      {selectedView === 'properties' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties?.slice(0, 12).map((property: Property, index: number) => (
              <div key={`${property.name}-${index}`} className="border rounded-lg p-4">
                <h3 className="font-semibold">{property.name}</h3>
                <p className="text-gray-600">{property.location}</p>
                <p className="text-lg font-bold">${property.price}/night</p>
                <p>{property.bedrooms} beds • {property.bathrooms} baths</p>
                <span className={`px-2 py-1 rounded text-sm ${property.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {property.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings */}
      {selectedView === 'bookings' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Property</th>
                  <th className="text-left p-2">Check In</th>
                  <th className="text-left p-2">Check Out</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {bookings?.slice(0, 10).map((booking: Booking, index: number) => (
                  <tr key={`${booking.checkIn}-${booking.checkOut}-${index}`} className="border-b">
                    <td className="p-2">{booking.property?.[0]?.name || 'N/A'}</td>
                    <td className="p-2">{booking.checkIn}</td>
                    <td className="p-2">{booking.checkOut}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-2">${booking.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics */}
      {selectedView === 'analytics' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Property Status Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Available</span>
                  <span>{properties?.filter((p: Property) => p.status === 'available').length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Booked</span>
                  <span>{properties?.filter((p: Property) => p.status === 'booked').length || 0}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Booking Status Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Completed</span>
                  <span>{bookings?.filter((b: Booking) => b.status === 'completed').length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Confirmed</span>
                  <span>{bookings?.filter((b: Booking) => b.status === 'confirmed').length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending</span>
                  <span>{bookings?.filter((b: Booking) => b.status === 'pending').length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cancelled</span>
                  <span>{bookings?.filter((b: Booking) => b.status === 'cancelled').length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
