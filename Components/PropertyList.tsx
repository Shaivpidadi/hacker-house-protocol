'use client';

import { useProperties, useCreatePropertyWithImage } from '@/lib/hooks';
import { useState } from 'react';

export function PropertyList() {
  const [filters, setFilters] = useState({
    status: 'available',
    location: '',
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    wifi: undefined
  });

  const { data: properties, loading, error } = useProperties(filters);
  const createPropertyWithImage = useCreatePropertyWithImage();

  const handleCreateProperty = async (propertyData: any) => {
    try {
      await createPropertyWithImage(propertyData, propertyData.imageUrl);
      // Property will automatically appear in the list due to real-time sync
    } catch (error) {
      console.error('Failed to create property:', error);
    }
  };

  if (loading) return <div>Loading properties...</div>;
  if (error) return <div>Error loading properties: {error.message}</div>;

  return (
    <div>
      <h2>Available Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties?.map((property) => (
          <div key={property.id} className="border rounded-lg p-4">
            {property.image && (
              <img 
                src={property.image.url} 
                alt={property.name}
                className="w-full h-48 object-cover rounded"
              />
            )}
            <h3 className="text-lg font-semibold mt-2">{property.name}</h3>
            <p className="text-gray-600">{property.location}</p>
            <p className="text-lg font-bold">${property.price}/night</p>
            <p>{property.bedrooms} bedrooms • {property.bathrooms} bathrooms</p>
            {property.wifi && <span className="text-green-600">✓ WiFi</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
