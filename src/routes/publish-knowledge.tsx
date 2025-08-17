import { AuthGuard } from '@/components/auth-guard';
import { PublishProperty } from '@/components/publish-property';
import { PublishHacker } from '@/components/publish-hacker';
import { PublishBooking } from '@/components/publish-booking';
import { BulkUpload } from '@/components/bulk-upload';
import { useUserInfo } from '@/lib/auth';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/publish-knowledge')({
  component: PublishKnowledgePage,
});

function PublishKnowledgePage() {
  const user = useUserInfo();
  const [activeTab, setActiveTab] = useState<'property' | 'hacker' | 'booking' | 'bulk'>('booking');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Publish to Knowledge Graph
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Add data to your public knowledge graph. This information will be publicly accessible and searchable.
        </p>
      </div>

      <AuthGuard requireAuth={true}>
        <div className="max-w-4xl mx-auto">
          {/* user info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome, {user?.name || 'User'}!
                </h2>
                <p className="text-gray-600">
                  Authentication Status: <span className="font-medium text-green-600">✓ Authenticated</span>
                </p>
                <p className="text-gray-600">
                  User ID: <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{user?.id || 'N/A'}</span>
                </p>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* publishing tabs */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('property')}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'property'
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Publish Property
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('hacker')}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'hacker'
                      ? 'bg-green-50 text-green-700 border-b-2 border-green-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Publish Hacker Profile
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('booking')}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'booking'
                      ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Publish Complete Booking
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('bulk')}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'bulk'
                      ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Bulk Upload
                  </div>
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'property' && <PublishProperty />}
              {activeTab === 'hacker' && <PublishHacker />}
              {activeTab === 'booking' && <PublishBooking />}
              {activeTab === 'bulk' && <BulkUpload />}
            </div>
          </div>

          {/* publishing info */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Publishing Information</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>All published data will be stored in your public space</li>
                    <li>Data becomes publicly accessible and searchable</li>
                    <li>You can view published data in the "Explore Public Knowledge" section</li>
                    <li>Each entity gets a unique ID that can be referenced by other entities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    </div>
  );
}
