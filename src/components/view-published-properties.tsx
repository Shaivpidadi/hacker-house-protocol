import { Property } from '@/schema';
import { useQuery, useSpaces } from '@graphprotocol/hypergraph-react';
import { GraphImage } from '@/components/graph-image';
import { useState, useEffect } from 'react';

export function ViewPublishedProperties() {
  const { data: publicSpaces } = useSpaces({ mode: 'public' });
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // auto-select first public space if none selected
  useEffect(() => {
    if (publicSpaces && publicSpaces.length > 0 && !selectedSpace) {
      setSelectedSpace(publicSpaces[0].id);
    }
  }, [publicSpaces, selectedSpace]);

  // query properties from the public space
  const { data: properties, isPending, error } = useQuery(Property, {
    mode: 'public',
    space: selectedSpace || undefined,
    first: 100,
    include: { image: {} },
    filter: {
      name: {
        contains: searchTerm,
      },
    },
  });

  if (!selectedSpace) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading public spaces...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Properties</h3>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* search and filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Properties</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="studio">Studio</option>
              <option value="loft">Loft</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Under Maintenance</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              {properties.length} properties found
            </div>
          </div>
        </div>
      </div>

      {/* loading state */}
      {isPending && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      )}

      {/* properties grid */}
      {!isPending && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              {/* property image */}
              <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
                {property.image?.[0]?.url ? (
                  <GraphImage
                    src={property.image[0].url}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                )}
                
                {/* status badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    property.status === 'available' ? 'bg-green-100 text-green-800' :
                    property.status === 'rented' ? 'bg-red-100 text-red-800' :
                    property.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>

              {/* property details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{property.name}</h3>
                <p className="text-gray-600 mb-3">{property.location}</p>
                
                {property.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{property.description}</p>
                )}

                {/* property specs */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">${property.price}</div>
                    <div className="text-xs text-gray-500">per month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{property.size}</div>
                    <div className="text-xs text-gray-500">sq ft</div>
                  </div>
                </div>

                {/* room details */}
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>🛏️ {property.bedrooms} bed</span>
                  <span>🚿 {property.bathrooms} bath</span>
                  <span>🚗 {property.parking} parking</span>
                </div>

                {/* amenities */}
                {property.amenities && (
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-700 mb-1">Amenities:</div>
                    <div className="text-xs text-gray-600 line-clamp-1">{property.amenities}</div>
                  </div>
                )}

                {/* features */}
                {property.features && (
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-700 mb-1">Features:</div>
                    <div className="text-xs text-gray-600 line-clamp-1">{property.features}</div>
                  </div>
                )}

                {/* wifi indicator */}
                {property.wifi && (
                  <div className="flex items-center text-sm text-green-600 mb-2">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    WiFi Available
                  </div>
                )}

                {/* entity id */}
                <div className="text-xs text-gray-400 font-mono mt-4 pt-4 border-t border-gray-100">
                  ID: {property.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* empty state */}
      {!isPending && properties.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
          <p className="text-gray-500">No properties match your current filters.</p>
        </div>
      )}
    </div>
  );
}
