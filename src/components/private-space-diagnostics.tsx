import { Booking } from '@/schema';
import { useQuery, useSpaces } from '@graphprotocol/hypergraph-react';
import { useEffect, useState } from 'react';

export function PrivateSpaceDiagnostics() {
  const { data: privateSpaces } = useSpaces({ mode: 'private' });
  const [selectedSpace, setSelectedSpace] = useState<string>('');

  // auto-select first private space
  useEffect(() => {
    if (privateSpaces && privateSpaces.length > 0 && !selectedSpace) {
      setSelectedSpace(privateSpaces[0].id);
    }
  }, [privateSpaces, selectedSpace]);

  if (!selectedSpace) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading private spaces...</p>
      </div>
    );
  }

  return (
    <PrivateSpaceDiagnosticsContent spaceId={selectedSpace} />
  );
}

function PrivateSpaceDiagnosticsContent({ spaceId }: { spaceId: string }) {
  // query only bookings from private space to test if bulk upload worked
  const { data: bookings, isPending: bookingsLoading, error: bookingsError } = useQuery(Booking, {
    mode: 'private',
    space: spaceId,
    first: 1000
  });

  const isLoading = bookingsLoading;

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Querying private space data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Private Space Diagnostics
        </h2>
        <p className="text-gray-600">
          Testing if bulk upload created bookings in your private space.
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Private Space Data Summary</h3>
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600">{bookings?.length || 0}</div>
          <div className="text-lg text-gray-600">Bookings Found</div>
        </div>
      </div>

      {/* Query Status */}
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
        </div>
      </div>

      {/* Sample Data */}
      {bookings && bookings.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sample Booking Data (First 2)
          </h3>
          <div className="space-y-4">
            {bookings.slice(0, 2).map((booking, index) => (
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

      {/* Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Next Steps</h3>
        <div className="space-y-3 text-sm text-blue-800">
          {(!bookings || bookings.length === 0) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p><strong>No data found in private space:</strong></p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>The bulk import may have failed</li>
                <li>Check the browser console for errors during import</li>
                <li>Try the bulk import again with a smaller dataset</li>
                <li>Verify your JSON/CSV file format</li>
              </ul>
            </div>
          )}
          
          {(bookings && bookings.length > 0) && (
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <p><strong>Data found in private space:</strong></p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Your bulk import was successful!</li>
                <li>Now you need to publish this data to your public space</li>
                <li>Go to "Publish to Knowledge Graph" → "Publish to Public" tab</li>
                <li>Select your private space as source and public space as target</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
