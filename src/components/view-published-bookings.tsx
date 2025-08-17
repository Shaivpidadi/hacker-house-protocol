import { Booking } from '@/schema';
import { useQuery, useSpaces } from '@graphprotocol/hypergraph-react';
import { useState, useEffect } from 'react';

export function ViewPublishedBookings() {
  const { data: publicSpaces } = useSpaces({ mode: 'public' });
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // auto-select first public space if none selected
  useEffect(() => {
    if (publicSpaces && publicSpaces.length > 0 && !selectedSpace) {
      setSelectedSpace(publicSpaces[0].id);
    }
  }, [publicSpaces, selectedSpace]);

  const { data: bookings, isPending, error } = useQuery(Booking, {
    mode: 'public',
    space: selectedSpace || undefined,
    first: 100,
    filter: searchTerm ? {
      notes: { contains: searchTerm }
    } : undefined,
    include: {
      property: {},
      hackers: {},
      landlord: {}
    }
  });

  const filteredBookings = bookings?.filter(booking => {
    if (statusFilter !== 'all' && booking.status !== statusFilter) {
      return false;
    }
    return true;
  });

  if (!selectedSpace) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="ml-3 text-gray-600">Loading public spaces...</p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-red-800">Error loading bookings: {error.message}</p>
        </div>
        <p className="text-red-600 text-sm mt-2">
          This might be because there are no bookings in this space, or the space doesn't contain booking data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Notes</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search in booking notes..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div className="sm:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Published Bookings ({filteredBookings?.length || 0})
          </h3>
        </div>

        {!isPending && filteredBookings?.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'No bookings match your search criteria.' : 'This space doesn\'t contain any booking data yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBookings?.map((booking) => (
              <div key={booking.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* booking details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {booking.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Total Price:</span>
                        <span className="ml-2 text-sm text-gray-900">${booking.totalPrice}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Guest Count:</span>
                        <span className="ml-2 text-sm text-gray-900">{booking.guestCount}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Payment Status:</span>
                        <span className={`ml-2 text-sm ${
                          booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-700">Notes:</span>
                        <p className="mt-1 text-sm text-gray-600">{booking.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* property details */}
                  {booking.property?.[0] && (
                    <div className="lg:w-64 bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Property</h4>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="font-medium">Name:</span>
                          <span className="ml-1 text-gray-600">{booking.property[0].name}</span>
                        </div>
                        <div>
                          <span className="font-medium">Location:</span>
                          <span className="ml-1 text-gray-600">{booking.property[0].location}</span>
                        </div>
                        <div>
                          <span className="font-medium">Type:</span>
                          <span className="ml-1 text-gray-600 capitalize">{booking.property[0].type}</span>
                        </div>
                        <div>
                          <span className="font-medium">Price:</span>
                          <span className="ml-1 text-gray-600">${booking.property[0].price}/night</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* hackers and landlord */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* hackers */}
                  {booking.hackers && booking.hackers.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Hackers ({booking.hackers.length})</h4>
                      <div className="space-y-2">
                        {booking.hackers.map((hacker) => (
                          <div key={hacker.id} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                {hacker.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{hacker.name}</div>
                              {hacker.githubUrl && (
                                <div className="text-xs text-gray-500">
                                  <a href={hacker.githubUrl} target="_blank" rel="noopener noreferrer" 
                                     className="text-blue-600 hover:underline">
                                    GitHub
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* landlord */}
                  {booking.landlord?.[0] && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Landlord</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {booking.landlord[0].name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{booking.landlord[0].name}</div>
                          <div className="text-xs text-gray-500">
                            {booking.landlord[0].verified ? '✓ Verified' : 'Unverified'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
