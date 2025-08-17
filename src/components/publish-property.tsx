import { Property, Image } from '@/schema';
import { useCreateEntity, useSpaces } from '@graphprotocol/hypergraph-react';
import { useState } from 'react';

interface PublishPropertyFormData {
  name: string;
  description: string;
  location: string;
  price: number;
  size: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  amenities: string;
  wifi: boolean;
  features: string;
  status: string;
  type: string;
  deposit: number;
  imageUrl: string;
}

export function PublishProperty() {
  const { data: spaces } = useSpaces({ mode: 'public' });
  const createProperty = useCreateEntity(Property);
  const createImage = useCreateEntity(Image);
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // get the first available space (you might want to let users choose)
  const publicSpace = spaces?.find((space) => space.name === 'Public Space');

  const [formData, setFormData] = useState<PublishPropertyFormData>({
    name: '',
    description: '',
    location: '',
    price: 0,
    size: 0,
    bedrooms: 1,
    bathrooms: 1,
    parking: 0,
    amenities: '',
    wifi: false,
    features: '',
    status: 'available',
    type: 'apartment',
    deposit: 0,
    imageUrl: ''
  });

  const handleInputChange = (field: keyof PublishPropertyFormData, value: string | number | boolean) => {
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
      // create image entity if image url is provided
      let imageEntity = null;
      if (formData.imageUrl) {
        imageEntity = await createImage({ url: formData.imageUrl });
      }

      // create property entity
      const propertyData = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        price: formData.price,
        size: formData.size,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        parking: formData.parking,
        amenities: formData.amenities,
        wifi: formData.wifi,
        features: formData.features,
        status: formData.status,
        type: formData.type,
        deposit: formData.deposit,
        ...(imageEntity && { image: [imageEntity.id] })
      };

      const property = await createProperty(propertyData);

      setMessage({ 
        type: 'success', 
        text: `Property "${formData.name}" published successfully! Entity ID: ${property.id}` 
      });

      // reset form
      setFormData({
        name: '',
        description: '',
        location: '',
        price: 0,
        size: 0,
        bedrooms: 1,
        bathrooms: 1,
        parking: 0,
        amenities: '',
        wifi: false,
        features: '',
        status: 'available',
        type: 'apartment',
        deposit: 0,
        imageUrl: ''
      });

    } catch (error) {
      console.error('Error publishing property:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to publish property: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Publish Property to Knowledge Graph
        </h2>
        <p className="text-gray-600">
          Add a new property to your public knowledge graph. This data will be publicly accessible.
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
        {/* basic information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter property name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="City, Country"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the property..."
          />
        </div>

        {/* pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (USD) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange('price', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deposit (USD)
            </label>
            <input
              type="number"
              min="0"
              value={formData.deposit}
              onChange={(e) => handleInputChange('deposit', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size (sq ft)
            </label>
            <input
              type="number"
              min="0"
              value={formData.size}
              onChange={(e) => handleInputChange('size', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* rooms */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <input
              type="number"
              min="0"
              value={formData.bedrooms}
              onChange={(e) => handleInputChange('bedrooms', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bathrooms
            </label>
            <input
              type="number"
              min="0"
              value={formData.bathrooms}
              onChange={(e) => handleInputChange('bathrooms', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parking Spaces
            </label>
            <input
              type="number"
              min="0"
              value={formData.parking}
              onChange={(e) => handleInputChange('parking', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* property details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="studio">Studio</option>
              <option value="loft">Loft</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Under Maintenance</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amenities
          </label>
          <input
            type="text"
            value={formData.amenities}
            onChange={(e) => handleInputChange('amenities', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Gym, Pool, Garden, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features
          </label>
          <input
            type="text"
            value={formData.features}
            onChange={(e) => handleInputChange('features', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Air conditioning, Heating, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => handleInputChange('imageUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="wifi"
            checked={formData.wifi}
            onChange={(e) => handleInputChange('wifi', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="wifi" className="ml-2 block text-sm text-gray-700">
            WiFi Available
          </label>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isPublishing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Publishing...
              </div>
            ) : (
              'Publish Property'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
