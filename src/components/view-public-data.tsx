import { Booking, Property, Hacker, Landlord } from '@/schema';
import { useQuery, useSpaces } from '@graphprotocol/hypergraph-react';
import { useState, useEffect } from 'react';

export function ViewPublicData() {
  const { data: publicSpaces } = useSpaces({ mode: 'public' });
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'bookings' | 'properties' | 'hackers' | 'landlords'>('bookings');

  // auto-select first public space if none selected
  useEffect(() => {
    console.log('ViewPublicData: publicSpaces:', publicSpaces);
    console.log('ViewPublicData: selectedSpace:', selectedSpace);
    
    if (publicSpaces && publicSpaces.length > 0 && !selectedSpace) {
      console.log('ViewPublicData: Auto-selecting space:', publicSpaces[0].id);
      setSelectedSpace(publicSpaces[0].id);
    }
  }, [publicSpaces, selectedSpace]);

  // query entities from public space - only when space is selected
  const { data: bookings } = useQuery(Booking, { 
    mode: 'public',
    space: selectedSpace,
    filter: searchTerm ? { notes: { contains: searchTerm } } : undefined,
    include: { property: {}, hackers: {}, landlord: {} }
  });
  
  const { data: properties } = useQuery(Property, { 
    mode: 'public',
    space: selectedSpace,
    filter: searchTerm ? { name: { contains: searchTerm } } : undefined,
    include: { image: {} }
  });
  
  const { data: hackers } = useQuery(Hacker, { 
    mode: 'public',
    space: selectedSpace,
    filter: searchTerm ? { name: { contains: searchTerm } } : undefined,
    include: { avatar: {} }
  });
  
  const { data: landlords } = useQuery(Landlord, { 
    mode: 'public',
    space: selectedSpace,
    filter: searchTerm ? { name: { contains: searchTerm } } : undefined,
    include: { avatar: {} }
  });

  const renderBookings = () => (
    <div className="space-y-4">
      {bookings?.map((booking) => (
        <div key={booking.id} className="bg-white border rounded-lg p-4 shadow-sm">
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
      ))}
    </div>
  );

  const renderProperties = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {properties?.map((property) => (
        <div key={property.id} className="bg-white border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{property.description}</p>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">{property.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-medium">${property.price}/night</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bedrooms:</span>
              <span className="font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bathrooms:</span>
              <span className="font-medium">{property.bathrooms}</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              property.status === 'available' ? 'bg-green-100 text-green-800' :
              property.status === 'booked' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {property.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderHackers = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {hackers?.map((hacker) => (
        <div key={hacker.id} className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold">
                {hacker.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{hacker.name}</h3>
              <p className="text-sm text-gray-600">Hacker</p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            {hacker.githubUrl && (
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">GitHub:</span>
                <a href={hacker.githubUrl} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">
                  {hacker.githubUrl.split('/').pop()}
                </a>
              </div>
            )}
            {hacker.twitterUrl && (
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Twitter:</span>
                <a href={hacker.twitterUrl} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">
                  @{hacker.twitterUrl.split('/').pop()}
                </a>
              </div>
            )}
            {hacker.walletAddress && (
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Wallet:</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {hacker.walletAddress.slice(0, 8)}...{hacker.walletAddress.slice(-6)}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderLandlords = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {landlords?.map((landlord) => (
        <div key={landlord.id} className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold">
                {landlord.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{landlord.name}</h3>
              <p className="text-sm text-gray-600">Landlord</p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Verified:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                landlord.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {landlord.verified ? 'Yes' : 'No'}
              </span>
            </div>
            {landlord.walletAddress && (
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Wallet:</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {landlord.walletAddress.slice(0, 8)}...{landlord.walletAddress.slice(-6)}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          View Public Data
        </h2>
        <p className="text-gray-600">
          Explore and query the published data from your public spaces.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="space-y-6">
          {/* space selection and search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Public Space
              </label>
              <select
                value={selectedSpace}
                onChange={(e) => setSelectedSpace(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select public space...</option>
                {publicSpaces?.map((space) => (
                  <option key={space.id} value={space.id}>
                    {space.name} ({space.id.slice(0, 8)}...)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search entities..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* entity type tabs */}
          {selectedSpace && (
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'bookings'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Bookings ({bookings?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'properties'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Properties ({properties?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('hackers')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'hackers'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Hackers ({hackers?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('landlords')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'landlords'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Landlords ({landlords?.length || 0})
                </button>
              </nav>
            </div>
          )}

          {/* entity content */}
          {!publicSpaces ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading public spaces...</p>
            </div>
          ) : selectedSpace ? (
            <div className="min-h-[400px]">
              {activeTab === 'bookings' && renderBookings()}
              {activeTab === 'properties' && renderProperties()}
              {activeTab === 'hackers' && renderHackers()}
              {activeTab === 'landlords' && renderLandlords()}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-600">No public spaces available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
