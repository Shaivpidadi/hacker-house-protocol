import { Booking, Property, Hacker } from '@/schema';
import { useQuery, useSpaces } from '@graphprotocol/hypergraph-react';
import { useState, useEffect } from 'react';

export function TestPublicQuery() {
  const { data: publicSpaces } = useSpaces({ mode: 'public' });
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [queryResults, setQueryResults] = useState<{
    bookings: unknown[];
    properties: unknown[];
    hackers: unknown[];
    timestamp: string;
  } | null>(null);

  // auto-select first public space if none selected
  useEffect(() => {
    if (publicSpaces && publicSpaces.length > 0 && !selectedSpace) {
      setSelectedSpace(publicSpaces[0].id);
    }
  }, [publicSpaces, selectedSpace]);

  // test queries - only when space is selected
  const { data: bookings, isLoading: bookingsLoading } = useQuery(Booking, { 
    mode: 'public',
    space: selectedSpace,
    include: { property: {}, hackers: {}, landlord: {} }
  });
  
  const { data: properties, isLoading: propertiesLoading } = useQuery(Property, { 
    mode: 'public',
    space: selectedSpace
  });
  
  const { data: hackers, isLoading: hackersLoading } = useQuery(Hacker, { 
    mode: 'public',
    space: selectedSpace
  });

  const runTestQueries = () => {
    setQueryResults({
      bookings: bookings || [],
      properties: properties || [],
      hackers: hackers || [],
      timestamp: new Date().toISOString()
    });
  };

  const isLoading = bookingsLoading || propertiesLoading || hackersLoading;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Test Public Data Queries
        </h2>
        <p className="text-gray-600">
          Verify that your published data is queryable from the public space.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="space-y-6">
          {/* space selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Public Space to Test
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

          {/* test button */}
          <div className="flex justify-center">
            <button
              onClick={runTestQueries}
              disabled={!selectedSpace || isLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Test Queries
                </>
              )}
            </button>
          </div>

          {/* results */}
          {queryResults && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Query Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Bookings</h4>
                  <div className="text-2xl font-bold text-green-600">{queryResults.bookings.length}</div>
                  <p className="text-sm text-green-700">Found in public space</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Properties</h4>
                  <div className="text-2xl font-bold text-blue-600">{queryResults.properties.length}</div>
                  <p className="text-sm text-blue-700">Found in public space</p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Hackers</h4>
                  <div className="text-2xl font-bold text-purple-600">{queryResults.hackers.length}</div>
                  <p className="text-sm text-purple-700">Found in public space</p>
                </div>
              </div>

              {/* sample data */}
              {queryResults.bookings.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Sample Booking Data</h4>
                  <div className="bg-white rounded border p-3">
                    <pre className="text-xs text-gray-600 overflow-x-auto">
                      {JSON.stringify(queryResults.bookings[0], null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <p><strong>Query Time:</strong> {queryResults.timestamp}</p>
                <p><strong>Space ID:</strong> {selectedSpace}</p>
              </div>
            </div>
          )}

          {/* instructions */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Query Your Data</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• <strong>Public Space ID:</strong> Use this ID to query your data: <code className="bg-gray-100 px-2 py-1 rounded">{selectedSpace || 'Select a space'}</code></p>
              <p>• <strong>Direct Queries:</strong> Anyone can query this data using the space ID</p>
              <p>• <strong>API Access:</strong> Data is accessible via Hypergraph queries</p>
              <p>• <strong>Global Registry:</strong> This data is in your public space but not automatically in the global registry</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
