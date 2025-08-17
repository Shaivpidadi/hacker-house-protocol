import { Booking } from '@/schema';
import { useQuery } from '@graphprotocol/hypergraph-react';
import { useState } from 'react';

export function ViewPublishedBookings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: bookings, isPending, error } = useQuery(Booking, {
    mode: 'public',
    filter: {
      notes: { contains: searchTerm }
    },
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
        <p className="text-red-800">Error loading bookings: {error.message}</p>
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

        {filteredBookings?.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {bookings?.length === 0 ? 'No bookings found in your public space.' : 'No bookings match your filters.'}
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
