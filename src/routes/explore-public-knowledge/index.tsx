import { createFileRoute } from '@tanstack/react-router';
import { useSpaces } from '@graphprotocol/hypergraph-react';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/explore-public-knowledge/')({
  component: ExplorePublicKnowledgeIndex,
});

function ExplorePublicKnowledgeIndex() {
  const { data: publicSpaces, isPending } = useSpaces({ mode: 'public' });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSpaces = publicSpaces?.filter(space => 
    space.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    space.id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Explore Public Knowledge
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover and explore public spaces on the Graph Protocol. Each space contains knowledge that has been published for public access.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search public spaces..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
      </div>

      {isPending && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading public spaces...</p>
        </div>
      )}

      {!isPending && filteredSpaces.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Public Spaces Found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'No spaces match your search criteria.' : 'No public spaces are currently available.'}
          </p>
        </div>
      )}

      {!isPending && filteredSpaces.length > 0 && (
        <>
          <div className="text-center mb-6">
            <p className="text-gray-600">
              Found {filteredSpaces.length} public space{filteredSpaces.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSpaces.map((space) => (
              <Link
                key={space.id}
                to="/public-space/$space-id"
                params={{ 'space-id': space.id }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1 z-10"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative p-6">
                  {/* Space icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">
                      {space.name?.charAt(0).toUpperCase() || 'S'}
                    </span>
                  </div>

                  {/* Space name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {space.name || 'Unnamed Space'}
                  </h3>

                  {/* Space ID */}
                  <p className="text-[10px] text-gray-500 mb-2 font-mono">{space.id}</p>

                  {/* Space description - removed since not available in space object */}

                  {/* Explore button */}
                  <div className="flex items-center text-sm text-blue-600 group-hover:text-blue-700 transition-colors">
                    <span>Explore Space</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
