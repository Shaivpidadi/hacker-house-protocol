'use client';

import { useSeedDatabase } from '@/lib/seed-data';
import { useState } from 'react';

export function SeedDatabase() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [result, setResult] = useState<{ success: boolean; error?: unknown } | null>(null);
  const seedDatabase = useSeedDatabase();

  const handleSeed = async () => {
    setIsSeeding(true);
    setResult(null);
    
    try {
      const result = await seedDatabase();
      setResult(result);
    } catch (error) {
      setResult({ success: false, error });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Database Seeding</h3>
      <p className="text-gray-600 mb-4">
        Create mock data for testing: 50 hackers, 20 landlords, 100 properties, 200 bookings, 150 reviews, 30 events
      </p>
      
      <button
        onClick={handleSeed}
        disabled={isSeeding}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSeeding ? 'Seeding...' : 'Seed Database'}
      </button>

      {result && (
        <div className={`mt-4 p-3 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {result.success ? (
            <p>✅ Database seeded successfully!</p>
          ) : (
            <p>❌ Seeding failed: {result.error instanceof Error ? result.error.message : String(result.error)}</p>
          )}
        </div>
      )}
    </div>
  );
}


