import { Booking, Property, Hacker, Landlord, Image } from '@/schema';
import { useQuery, useSpaces } from '@graphprotocol/hypergraph-react';
import { useEffect, useState } from 'react';

export function DataDiagnostics() {
  const { data: publicSpaces } = useSpaces({ mode: 'public' });
  const [selectedSpace, setSelectedSpace] = useState<string>('');

  // auto-select first public space
  useEffect(() => {
    if (publicSpaces && publicSpaces.length > 0 && !selectedSpace) {
      setSelectedSpace(publicSpaces[0].id);
    }
  }, [publicSpaces, selectedSpace]);

  // query all entities with detailed error handling
  const { data: bookings, isPending: bookingsLoading, error: bookingsError } = useQuery(Booking, {
    mode: 'public',
    space: selectedSpace || undefined,
    first: 1000
  });

  const { data: properties, isPending: propertiesLoading, error: propertiesError } = useQuery(Property, {
    mode: 'public',
    space: selectedSpace || undefined,
    first: 1000
  });

  const { data: hackers, isPending: hackersLoading, error: hackersError } = useQuery(Hacker, {
    mode: 'public',
    space: selectedSpace || undefined,
    first: 1000
  });

  const { data: landlords, isPending: landlordsLoading, error: landlordsError } = useQuery(Landlord, {
    mode: 'public',
    space: selectedSpace || undefined,
    first: 1000
  });

  const { data: images, isPending: imagesLoading, error: imagesError } = useQuery(Image, {
    mode: 'public',
    space: selectedSpace || undefined,
    first: 1000
  });

  const isLoading = bookingsLoading || propertiesLoading || hackersLoading || landlordsLoading || imagesLoading;

  if (!selectedSpace) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading public spaces...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Querying data from space...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          Data Diagnostics
        </h2>
        <p className="text-gray-600">
          Space ID: <code className="bg-gray-100 px-2 py-1 rounded">{selectedSpace}</code>
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h3>
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

      {/* Error Analysis */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Query Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Bookings Query:</span>
            {bookingsError ? (
              <span className="text-red-600">❌ Error: {bookingsError.message}</span>
            ) : (
              <span className="text-green-600">✅ Success ({bookings?.length || 0} found)</span>
            )}
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Properties Query:</span>
            {propertiesError ? (
              <span className="text-red-600">❌ Error: {propertiesError.message}</span>
            ) : (
              <span className="text-green-600">✅ Success ({properties?.length || 0} found)</span>
            )}
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Hackers Query:</span>
            {hackersError ? (
              <span className="text-red-600">❌ Error: {hackersError.message}</span>
            ) : (
              <span className="text-green-600">✅ Success ({hackers?.length || 0} found)</span>
            )}
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Landlords Query:</span>
            {landlordsError ? (
              <span className="text-red-600">❌ Error: {landlordsError.message}</span>
            ) : (
              <span className="text-green-600">✅ Success ({landlords?.length || 0} found)</span>
            )}
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Images Query:</span>
            {imagesError ? (
              <span className="text-red-600">❌ Error: {imagesError.message}</span>
            ) : (
              <span className="text-green-600">✅ Success ({images?.length || 0} found)</span>
            )}
          </div>
        </div>
      </div>

      {/* Bookings Details */}
      {bookings && bookings.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Bookings Found ({bookings.length})
          </h3>
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Booking #{index + 1}</h4>
                  <span className="text-sm text-gray-500">ID: {booking.id}</span>
                </div>
                <pre className="text-sm text-gray-800 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                  {JSON.stringify(booking, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Troubleshooting Guide */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4">Troubleshooting Guide</h3>
        <div className="space-y-3 text-sm text-yellow-800">
          <p><strong>If you see 0 bookings:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>The bulk import may have failed silently</li>
            <li>Data may have been imported to a different space</li>
            <li>The JSON file may not have been in the correct format</li>
            <li>There may be a schema mismatch</li>
          </ul>
          <p className="mt-4"><strong>Next steps:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Check the browser console for any import errors</li>
            <li>Try importing a smaller subset of data first</li>
            <li>Verify the JSON structure matches your schema</li>
            <li>Check if you have multiple public spaces</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
