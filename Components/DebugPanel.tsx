'use client';

import { useState } from 'react';
import { useCreateEntity } from '@graphprotocol/hypergraph-react';
import { Property } from '@/app/schema';

export function DebugPanel() {
  const [result, setResult] = useState<{ success: boolean; data?: unknown; error?: unknown } | null>(null);
  const createProperty = useCreateEntity(Property);

  const testCreate = async () => {
    try {
      console.log('🧪 Testing property creation...');
      
      const testProperty = createProperty({
        name: "Test Property",
        description: "A test property",
        location: "Buenos Aires",
        price: 100,
        size: 1000,
        bedrooms: 2,
        bathrooms: 1,
        parking: 1,
        amenities: "wifi, kitchen",
        wifi: true,
        features: "High-speed internet",
        status: "available",
        type: "hackerhouse",
        deposit: 200
      });
      
      console.log('✅ Test property created:', testProperty);
      setResult({ success: true, data: testProperty });
    } catch (error) {
      console.error('❌ Test creation failed:', error);
      setResult({ success: false, error });
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4">
      <h3 className="font-bold mb-2">Debug Panel</h3>
      <button 
        onClick={testCreate}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Test Create Property
      </button>
      {result && (
        <div className="mt-2 p-2 bg-gray-200 rounded">
          <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
