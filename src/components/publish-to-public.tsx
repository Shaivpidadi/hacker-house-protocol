import { Booking, Property, Hacker, Landlord, Image } from '@/schema';
import { usePublishToPublicSpace, useQuery, useSpaces } from '@graphprotocol/hypergraph-react';
import { useState } from 'react';

export function PublishToPublic() {
  const { data: privateSpaces } = useSpaces({ mode: 'private' });
  const { data: publicSpaces } = useSpaces({ mode: 'public' });
  const [selectedPrivateSpace, setSelectedPrivateSpace] = useState<string>('');
  const [selectedPublicSpace, setSelectedPublicSpace] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // get entities from private space
  const { data: bookings } = useQuery(Booking, { 
    mode: 'private',
    space: selectedPrivateSpace || undefined
  });
  const { data: properties } = useQuery(Property, { 
    mode: 'private',
    space: selectedPrivateSpace || undefined
  });
  const { data: hackers } = useQuery(Hacker, { 
    mode: 'private',
    space: selectedPrivateSpace || undefined
  });
  const { data: landlords } = useQuery(Landlord, { 
    mode: 'private',
    space: selectedPrivateSpace || undefined
  });
  const { data: images } = useQuery(Image, { 
    mode: 'private',
    space: selectedPrivateSpace || undefined
  });

  const { mutate: publishToPublicSpace } = usePublishToPublicSpace({
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Successfully published to public space!' });
      setIsPublishing(false);
    },
    onError: (error) => {
      setMessage({ type: 'error', text: `Error publishing: ${error.message}` });
      setIsPublishing(false);
    }
  });

  const handlePublish = async () => {
    if (!selectedPrivateSpace || !selectedPublicSpace) {
      setMessage({ type: 'error', text: 'Please select both private and public spaces' });
      return;
    }

    setIsPublishing(true);
    setMessage(null);

    try {
      // collect all entities and validate they have IDs
      const allEntities = [
        ...(bookings || []),
        ...(properties || []),
        ...(hackers || []),
        ...(landlords || []),
        ...(images || [])
      ];

      // filter out entities without IDs and log them
      const validEntities = allEntities.filter(entity => {
        if (!entity || !entity.id) {
          console.warn('Entity without ID found:', entity);
          return false;
        }
        return true;
      });

      if (validEntities.length === 0) {
        setMessage({ type: 'error', text: 'No valid entities found to publish. All entities must have IDs.' });
        setIsPublishing(false);
        return;
      }

      console.log(`Publishing ${validEntities.length} valid entities to public space...`);
      console.log('Entities to publish:', validEntities.map(e => ({ id: e.id })));
      
      // publish entities one by one
      for (const entity of validEntities) {
        try {
          await publishToPublicSpace({ 
            entity: entity, 
            spaceId: selectedPublicSpace 
          });
        } catch (error) {
          console.error(`Failed to publish entity ${entity.id}:`, error);
          // continue with other entities
        }
      }

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: `Failed to publish: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
      setIsPublishing(false);
    }
  };

  const totalEntities = (bookings?.length || 0) + (properties?.length || 0) + 
                       (hackers?.length || 0) + (landlords?.length || 0) + (images?.length || 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Publish to Public Space
        </h2>
        <p className="text-gray-600">
          Publish your private entities to a public space so they can be queried by other users.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="space-y-6">
          {/* space selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Private Space
              </label>
              <select
                value={selectedPrivateSpace}
                onChange={(e) => setSelectedPrivateSpace(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select private space...</option>
                {privateSpaces?.map((space) => (
                  <option key={space.id} value={space.id}>
                    {space.name} ({space.id.slice(0, 8)}...)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Public Space
              </label>
              <select
                value={selectedPublicSpace}
                onChange={(e) => setSelectedPublicSpace(e.target.value)}
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
          </div>

          {/* entity summary */}
          {selectedPrivateSpace && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Entities to Publish</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{bookings?.length || 0}</div>
                  <div className="text-gray-600">Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{properties?.length || 0}</div>
                  <div className="text-gray-600">Properties</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{hackers?.length || 0}</div>
                  <div className="text-gray-600">Hackers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{landlords?.length || 0}</div>
                  <div className="text-gray-600">Landlords</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{images?.length || 0}</div>
                  <div className="text-gray-600">Images</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total: {totalEntities} entities
                </span>
              </div>
            </div>
          )}

          {/* publish button */}
          <div className="flex justify-center">
            <button
              onClick={handlePublish}
              disabled={!selectedPrivateSpace || !selectedPublicSpace || isPublishing || totalEntities === 0}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isPublishing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Publish to Public Space
                </>
              )}
            </button>
          </div>

          {/* instructions */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• <strong>Private Space:</strong> Select the private space containing your entities</p>
              <p>• <strong>Public Space:</strong> Select the public space where you want to publish the data</p>
              <p>• <strong>Publishing:</strong> All entities will be copied to the public space and become queryable</p>
              <p>• <strong>Relationships:</strong> Entity relationships will be preserved in the public space</p>
              <p>• <strong>Access:</strong> Once published, anyone can query this data using the public space ID</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
