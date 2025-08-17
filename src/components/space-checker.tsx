import { Booking, Property, Hacker, Landlord, Image } from '@/schema';
import { useQuery, useSpaces } from '@graphprotocol/hypergraph-react';
import { useState } from 'react';

export function SpaceChecker() {
  const { data: publicSpaces } = useSpaces({ mode: 'public' });
  const [selectedSpace, setSelectedSpace] = useState<string>('');

  // query all entities from the selected space - only when space is selected
  const { data: bookings } = useQuery(Booking, {
    mode: 'public',
    space: selectedSpace || undefined,
    first: 100
  });

  const { data: properties } = useQuery(Property, {
    mode: 'public',
    space: selectedSpace || undefined,
    first: 100
  });

  const { data: hackers } = useQuery(Hacker, {
    mode: 'public',
    space: selectedSpace || undefined,
    first: 100
  });

  const { data: landlords } = useQuery(Landlord, {
    mode: 'public',
    space: selectedSpace || undefined,
    first: 100
  });

  const { data: images } = useQuery(Image, {
    mode: 'public',
    space: selectedSpace || undefined,
    first: 100
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Check All Public Spaces
        </h2>
        <p className="text-gray-600">
          Let's check all your public spaces to see if the bookings were imported to a different space.
        </p>
      </div>

      {/* Space Selector */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Public Space</h3>
        <select
          value={selectedSpace}
          onChange={(e) => setSelectedSpace(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a public space...</option>
          {publicSpaces?.map((space) => (
            <option key={space.id} value={space.id}>
              {space.name || 'Unnamed Space'} ({space.id.slice(0, 8)}...)
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {selectedSpace && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Data in Space: {selectedSpace}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {bookings ? bookings.length : '...'}
              </div>
              <div className="text-sm text-gray-600">Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {properties ? properties.length : '...'}
              </div>
              <div className="text-sm text-gray-600">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {hackers ? hackers.length : '...'}
              </div>
              <div className="text-sm text-gray-600">Hackers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {landlords ? landlords.length : '...'}
              </div>
              <div className="text-sm text-gray-600">Landlords</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {images ? images.length : '...'}
              </div>
              <div className="text-sm text-gray-600">Images</div>
            </div>
          </div>

          {/* Show bookings if found */}
          {bookings && bookings.length > 0 && (
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Bookings Found:</h4>
              <div className="space-y-2">
                {bookings.map((booking, index) => (
                  <div key={booking.id} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Booking #{index + 1}</span>
                      <span className="text-sm text-gray-500">ID: {booking.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Instructions</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>1. <strong>Check each space</strong> - Select different spaces from the dropdown above</p>
          <p>2. <strong>Look for bookings</strong> - If you find bookings in any space, that's where your data went</p>
          <p>3. <strong>If no bookings found</strong> - The bulk import failed and we need to re-import</p>
          <p>4. <strong>Note the space ID</strong> - If you find data, remember which space it's in</p>
        </div>
      </div>
    </div>
  );
}
