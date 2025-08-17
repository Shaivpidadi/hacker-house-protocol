import { Booking, Property } from '@/schema';
import { useQuery, useSpaces, HypergraphSpaceProvider, useSpace } from '@graphprotocol/hypergraph-react';

export function SimpleBookingTest() {
  const { data: spaces } = useSpaces({ mode: 'private' });
  
  if (!spaces || spaces.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">No private space found. Please create a private space first.</p>
        </div>
      </div>
    );
  }

  const privateSpace = spaces?.[0]; // Use the first available private space

  if (!privateSpace) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">No private space found. Please create a private space first.</p>
        </div>
      </div>
    );
  }

  console.log('Available private spaces:', spaces);
  console.log('Selected private space:', privateSpace);

  return (
    <HypergraphSpaceProvider space={privateSpace.id}>
      <SimpleBookingTestContent />
    </HypergraphSpaceProvider>
  );
}

function SimpleBookingTestContent() {
  // get the space from context
  const { ready, name, id: spaceId } = useSpace({ mode: 'private' });
  
  console.log('SimpleBookingTestContent - space from context:', { ready, name, spaceId });
  
  // query for properties first since we know one was created
  const { data: properties, isPending: propertiesLoading, error: propertiesError } = useQuery(Property, {
    mode: 'private',
    space: spaceId,
    first: 10
  });

  // also query for bookings
  const { data: bookings, isPending: bookingsLoading, error: bookingsError } = useQuery(Booking, {
    mode: 'private',
    space: spaceId,
    first: 10
  });

  console.log('Properties query result:', { data: properties, loading: propertiesLoading, error: propertiesError });
  console.log('Bookings query result:', { data: bookings, loading: bookingsLoading, error: bookingsError });

  // show results even if still loading but we have data
  const hasData = (properties && properties.length > 0) || (bookings && bookings.length > 0);
  const isPending = (propertiesLoading || bookingsLoading) && !hasData;

  if (isPending) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Querying data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Simple Data Test
        </h2>
        <p className="text-gray-600">
          Using HypergraphSpaceProvider context
        </p>
      </div>

      <div className="space-y-6">
        {/* Properties Query Result */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Properties Query</h3>
          
          {propertiesError ? (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h4 className="font-medium text-red-800 mb-2">Properties Query Error:</h4>
              <p className="text-red-700">{propertiesError.message}</p>
              <pre className="mt-2 text-sm text-red-600 bg-red-100 p-2 rounded">
                {JSON.stringify(propertiesError, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h4 className="font-medium text-green-800 mb-2">Properties Query Success!</h4>
              <p className="text-green-700">
                Found {properties?.length || 0} properties in your private space.
              </p>
              {properties && properties.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-green-800 mb-2">Sample Property:</h5>
                  <pre className="text-sm text-green-700 bg-green-100 p-2 rounded overflow-auto">
                    {JSON.stringify(properties[0], null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bookings Query Result */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings Query</h3>
          
          {bookingsError ? (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h4 className="font-medium text-red-800 mb-2">Bookings Query Error:</h4>
              <p className="text-red-700">{bookingsError.message}</p>
              <pre className="mt-2 text-sm text-red-600 bg-red-100 p-2 rounded">
                {JSON.stringify(bookingsError, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h4 className="font-medium text-green-800 mb-2">Bookings Query Success!</h4>
              <p className="text-green-700">
                Found {bookings?.length || 0} bookings in your private space.
              </p>
              {bookings && bookings.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-green-800 mb-2">Sample Booking:</h5>
                  <pre className="text-sm text-green-700 bg-green-100 p-2 rounded overflow-auto">
                    {JSON.stringify(bookings[0], null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
