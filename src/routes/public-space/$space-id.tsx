import { Booking, Property, Hacker, Landlord, Image } from '@/schema';
import { HypergraphSpaceProvider, useQuery, useSpace } from '@graphprotocol/hypergraph-react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/public-space/$space-id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { 'space-id': spaceId } = Route.useParams();

  return (
    <HypergraphSpaceProvider space={spaceId}>
      <PublicSpace />
    </HypergraphSpaceProvider>
  );
}

function PublicSpace() {
  const { ready, name, id: spaceId } = useSpace({ mode: 'public' });
  const [activeTab, setActiveTab] = useState<'bookings' | 'properties' | 'hackers' | 'landlords'>('bookings');

  // query all entity types that were bulk uploaded
  const { data: bookings, isPending: bookingsLoading } = useQuery(Booking, { 
    mode: 'public',
    include: { property: {}, hackers: {}, landlord: {} }
  });
  
  const { data: properties, isPending: propertiesLoading } = useQuery(Property, { 
    mode: 'public',
    include: { image: {} }
  });
  
  const { data: hackers, isPending: hackersLoading } = useQuery(Hacker, { 
    mode: 'public',
    include: { avatar: {} }
  });
  
  const { data: landlords, isPending: landlordsLoading } = useQuery(Landlord, { 
    mode: 'public',
    include: { avatar: {} }
  });

  const { data: images, isPending: imagesLoading } = useQuery(Image, { 
    mode: 'public'
  });

  const isLoading = bookingsLoading || propertiesLoading || hackersLoading || landlordsLoading || imagesLoading;

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Loading space...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 mt-1 text-sm">Public Space</p>
            <h1 className="text-3xl font-bold text-slate-900">{name}</h1>
            <p className="text-slate-600 mt-1 text-sm">ID: {spaceId}</p>
          </div>
        </div>
      </div>

      {/* Data Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{bookings?.length || 0}</div>
              <div className="text-sm text-gray-600">Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{properties?.length || 0}</div>
              <div className="text-sm text-gray-600">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{hackers?.length || 0}</div>
              <div className="text-sm text-gray-600">Hackers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{landlords?.length || 0}</div>
              <div className="text-sm text-gray-600">Landlords</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{images?.length || 0}</div>
              <div className="text-sm text-gray-600">Images</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'bookings'
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Bookings ({bookings?.length || 0})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('properties')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'properties'
                    ? 'bg-green-50 text-green-700 border-b-2 border-green-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Properties ({properties?.length || 0})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('hackers')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'hackers'
                    ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Hackers ({hackers?.length || 0})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('landlords')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'landlords'
                    ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Landlords ({landlords?.length || 0})
                </div>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading && (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading data...</p>
              </div>
            )}

            {!isLoading && (
              <>
                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                  <div className="space-y-4">
                    {bookings && bookings.length > 0 ? (
                      bookings.map((booking) => (
                        <div key={booking.id} className="bg-gray-50 border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                Booking #{booking.id.slice(0, 8)}...
                              </h3>
                              <p className="text-sm text-gray-600">
                                {booking.checkIn} - {booking.checkOut}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Property:</span>
                              <p className="text-gray-600">{booking.property?.[0]?.name || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Hackers:</span>
                              <p className="text-gray-600">
                                {booking.hackers?.map(h => h.name).join(', ') || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Landlord:</span>
                              <p className="text-gray-600">{booking.landlord?.[0]?.name || 'N/A'}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Total Price: ${booking.totalPrice}</span>
                              <span className="text-gray-600">Guests: {booking.guestCount}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16">
                        <p className="text-gray-500">No bookings found in this public space.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Properties Tab */}
                {activeTab === 'properties' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties && properties.length > 0 ? (
                      properties.map((property) => (
                        <div key={property.id} className="bg-gray-50 border rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{property.description}</p>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Location:</span> {property.location}</p>
                            <p><span className="font-medium">Price:</span> ${property.price}</p>
                            <p><span className="font-medium">Type:</span> {property.type}</p>
                            <p><span className="font-medium">Status:</span> {property.status}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16 col-span-full">
                        <p className="text-gray-500">No properties found in this public space.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Hackers Tab */}
                {activeTab === 'hackers' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hackers && hackers.length > 0 ? (
                      hackers.map((hacker) => (
                        <div key={hacker.id} className="bg-gray-50 border rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{hacker.name}</h3>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Wallet:</span> {hacker.walletAddress}</p>
                            {hacker.githubUrl && (
                              <p><span className="font-medium">GitHub:</span> {hacker.githubUrl}</p>
                            )}
                            {hacker.twitterUrl && (
                              <p><span className="font-medium">Twitter:</span> {hacker.twitterUrl}</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16 col-span-full">
                        <p className="text-gray-500">No hackers found in this public space.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Landlords Tab */}
                {activeTab === 'landlords' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {landlords && landlords.length > 0 ? (
                      landlords.map((landlord) => (
                        <div key={landlord.id} className="bg-gray-50 border rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{landlord.name}</h3>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Wallet:</span> {landlord.walletAddress}</p>
                            <p><span className="font-medium">Verified:</span> {landlord.verified ? 'Yes' : 'No'}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16 col-span-full">
                        <p className="text-gray-500">No landlords found in this public space.</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
