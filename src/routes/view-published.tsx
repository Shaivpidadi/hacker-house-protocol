import { ViewPublishedProperties } from '@/components/view-published-properties';
import { ViewPublishedHackers } from '@/components/view-published-hackers';
import { ViewPublishedBookings } from '@/components/view-published-bookings';
import { ViewPublicData } from '@/components/view-public-data';
import { DataDiagnostics } from '@/components/data-diagnostics';
import { PrivateSpaceDiagnostics } from '@/components/private-space-diagnostics';
import { SimpleBookingTest } from '@/components/simple-booking-test';
import { SpaceChecker } from '@/components/space-checker';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/view-published')({
  component: ViewPublishedPage,
});

function ViewPublishedPage() {
  const [activeTab, setActiveTab] = useState<'properties' | 'hackers' | 'bookings' | 'public' | 'diagnostics' | 'private-diagnostics' | 'simple-test' | 'spaces'>('simple-test');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          View Published Knowledge Graph
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore the data that has been published to your public knowledge graph. This data is publicly accessible and searchable.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* navigation tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('properties')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'properties'
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Properties ({activeTab === 'properties' ? 'Active' : ''})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('hackers')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'hackers'
                    ? 'bg-green-50 text-green-700 border-b-2 border-green-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Hacker Profiles ({activeTab === 'hackers' ? 'Active' : ''})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'bookings'
                    ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Bookings ({activeTab === 'bookings' ? 'Active' : ''})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('public')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'public'
                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Public Data ({activeTab === 'public' ? 'Active' : ''})
                </div>
              </button>

              <button
                onClick={() => setActiveTab('diagnostics')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'diagnostics'
                    ? 'bg-red-50 text-red-700 border-b-2 border-red-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Public Diagnostics ({activeTab === 'diagnostics' ? 'Active' : ''})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('private-diagnostics')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'private-diagnostics'
                    ? 'bg-green-50 text-green-700 border-b-2 border-green-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Private Diagnostics ({activeTab === 'private-diagnostics' ? 'Active' : ''})
                </div>
              </button>

              <button
                onClick={() => setActiveTab('simple-test')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'simple-test'
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Simple Test ({activeTab === 'simple-test' ? 'Active' : ''})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('spaces')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'spaces'
                    ? 'bg-green-50 text-green-700 border-b-2 border-green-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Check Spaces ({activeTab === 'spaces' ? 'Active' : ''})
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'properties' && <ViewPublishedProperties />}
          {activeTab === 'hackers' && <ViewPublishedHackers />}
          {activeTab === 'bookings' && <ViewPublishedBookings />}
          {activeTab === 'public' && <ViewPublicData />}
          {activeTab === 'diagnostics' && <DataDiagnostics />}
          {activeTab === 'private-diagnostics' && <PrivateSpaceDiagnostics />}
          {activeTab === 'simple-test' && <SimpleBookingTest />}
          {activeTab === 'spaces' && <SpaceChecker />}
        </div>

        {/* info section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">About This Data</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>All data shown here is publicly accessible from your knowledge graph</li>
                  <li>Data is stored in your public space and can be queried by anyone</li>
                  <li>Each entity has a unique ID that can be referenced by other applications</li>
                  <li>You can add more data using the "Publish to Knowledge Graph" section</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
