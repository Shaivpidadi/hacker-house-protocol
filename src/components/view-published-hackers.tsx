import { Hacker } from '@/schema';
import { useQuery } from '@graphprotocol/hypergraph-react';
import { GraphImage } from '@/components/graph-image';
import { useState } from 'react';

export function ViewPublishedHackers() {
  const [searchTerm, setSearchTerm] = useState('');

  // query hackers from the public space
  const { data: hackers, isPending, error } = useQuery(Hacker, {
    mode: 'public',
    space: 'public', // this will query from the public space
    first: 100,
    include: { avatar: {} },
    filter: {
      name: {
        contains: searchTerm,
      },
    },
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Hackers</h3>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* search */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Hackers</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="text-sm text-gray-600">
            {hackers.length} hackers found
          </div>
        </div>
      </div>

      {/* loading state */}
      {isPending && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hackers...</p>
        </div>
      )}

      {/* hackers grid */}
      {!isPending && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackers.map((hacker) => (
            <div
              key={hacker.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              {/* hacker avatar */}
              <div className="h-48 bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
                {hacker.avatar?.[0]?.url ? (
                  <GraphImage
                    src={hacker.avatar[0].url}
                    alt={hacker.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        {hacker.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* hacker details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{hacker.name}</h3>
                
                {/* wallet address */}
                <div className="mb-4">
                  <div className="text-xs font-medium text-gray-700 mb-1">Wallet Address:</div>
                  <div className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded break-all">
                    {hacker.walletAddress}
                  </div>
                </div>

                {/* social links */}
                <div className="space-y-2 mb-4">
                  {hacker.githubUrl && (
                    <a
                      href={hacker.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub Profile
                    </a>
                  )}
                  
                  {hacker.twitterUrl && (
                    <a
                      href={hacker.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      Twitter/X Profile
                    </a>
                  )}
                </div>

                {/* entity id */}
                <div className="text-xs text-gray-400 font-mono mt-4 pt-4 border-t border-gray-100">
                  ID: {hacker.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* empty state */}
      {!isPending && hackers.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Hackers Found</h3>
          <p className="text-gray-500">No hackers match your current search.</p>
        </div>
      )}
    </div>
  );
}
