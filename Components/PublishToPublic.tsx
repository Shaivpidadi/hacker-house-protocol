'use client';

import { useState } from 'react';
import { usePublishToPublicSpace } from '@/lib/publish-to-public';
import { Button } from './ui/button';

export function PublishToPublic() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publicSpaceId, setPublicSpaceId] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const publishToPublicSpace = usePublishToPublicSpace();

  const handlePublish = async () => {
    if (!publicSpaceId.trim()) {
      setResult({ success: false, message: 'Please enter a public space ID' });
      return;
    }

    setIsPublishing(true);
    setResult(null);
    
    try {
      const result = await publishToPublicSpace(publicSpaceId.trim());
      if (result.success) {
        setResult({ 
          success: true, 
          message: '✅ Successfully published all entities to public space!' 
        });
      } else {
        setResult({ 
          success: false, 
          message: `❌ Publishing failed: ${result.error}` 
        });
      }
    } catch (error) {
      setResult({ 
        success: false, 
        message: `❌ Publishing error: ${error}` 
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md">
      <h2 className="text-xl font-bold mb-4">Publish to Public Space</h2>
      <p className="text-gray-600 mb-4">
        Publish your private data to a public space so others can see it.
      </p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="spaceId" className="block text-sm font-medium text-gray-700 mb-2">
            Public Space ID
          </label>
          <input
            id="spaceId"
            type="text"
            value={publicSpaceId}
            onChange={(e) => setPublicSpaceId(e.target.value)}
            placeholder="Enter your public space ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Button 
          onClick={handlePublish}
          disabled={isPublishing || !publicSpaceId.trim()}
          className="w-full"
        >
          {isPublishing ? '🚀 Publishing...' : '🚀 Publish to Public Space'}
        </Button>

        {result && (
          <div className={`p-4 rounded-lg ${
            result.success 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <p className="font-medium">{result.message}</p>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This will publish all entities from your private space to the specified public space. 
          Make sure you have the correct public space ID from your Hypergraph Geo Connect.
        </p>
      </div>
    </div>
  );
}
