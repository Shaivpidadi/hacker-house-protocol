import { Hacker, Image } from '@/schema';
import { useCreateEntity, useSpaces } from '@graphprotocol/hypergraph-react';
import { useState } from 'react';

interface PublishHackerFormData {
  name: string;
  walletAddress: string;
  githubUrl: string;
  twitterUrl: string;
  avatarUrl: string;
}

export function PublishHacker() {
  const { data: spaces } = useSpaces({ mode: 'public' });
  const createHacker = useCreateEntity(Hacker);
  const createImage = useCreateEntity(Image);
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // get the first available space (you might want to let users choose)
  const publicSpace = spaces?.[0];

  const [formData, setFormData] = useState<PublishHackerFormData>({
    name: '',
    walletAddress: '',
    githubUrl: '',
    twitterUrl: '',
    avatarUrl: ''
  });

  const handleInputChange = (field: keyof PublishHackerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicSpace) {
      setMessage({ type: 'error', text: 'No public space available for publishing' });
      return;
    }

    setIsPublishing(true);
    setMessage(null);

    try {
      // create image entity if avatar url is provided
      let avatarEntity = null;
      if (formData.avatarUrl) {
        avatarEntity = await createImage({ url: formData.avatarUrl });
      }

      // create hacker entity
      const hackerData = {
        name: formData.name,
        walletAddress: formData.walletAddress,
        githubUrl: formData.githubUrl,
        twitterUrl: formData.twitterUrl,
        ...(avatarEntity && { avatar: [avatarEntity.id] })
      };

      const hacker = await createHacker(hackerData);

      setMessage({ 
        type: 'success', 
        text: `Hacker "${formData.name}" published successfully! Entity ID: ${hacker.id}` 
      });

      // reset form
      setFormData({
        name: '',
        walletAddress: '',
        githubUrl: '',
        twitterUrl: '',
        avatarUrl: ''
      });

    } catch (error) {
      console.error('Error publishing hacker:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to publish hacker: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Publish Hacker Profile to Knowledge Graph
        </h2>
        <p className="text-gray-600">
          Add a new hacker profile to your public knowledge graph. This data will be publicly accessible.
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter hacker name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wallet Address *
          </label>
          <input
            type="text"
            required
            value={formData.walletAddress}
            onChange={(e) => handleInputChange('walletAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="0x..."
          />
          <p className="text-xs text-gray-500 mt-1">Enter the wallet address (0x format)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GitHub URL
          </label>
          <input
            type="url"
            value={formData.githubUrl}
            onChange={(e) => handleInputChange('githubUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="https://github.com/username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Twitter/X URL
          </label>
          <input
            type="url"
            value={formData.twitterUrl}
            onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="https://twitter.com/username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avatar URL
          </label>
          <input
            type="url"
            value={formData.avatarUrl}
            onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="https://example.com/avatar.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">Optional: URL to profile picture</p>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isPublishing}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Publishing...
              </div>
            ) : (
              'Publish Hacker Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
