"use client"

import { useState } from "react"

export default function HackerhouseDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="mb-8">
        <div className="glass rounded-lg p-6 glow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Hackerhouse Protocol
              </h1>
              <p className="text-purple-300 mt-1">Buenos Aires Ethereum Hackathon Dashboard</p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-purple-300 text-sm">Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Navigation */}
      <div className="flex space-x-4 mb-6">
        {(['overview', 'properties', 'bookings', 'analytics'] as const).map((view) => (
          <button
            key={view}
            onClick={() => setActiveTab(view)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === view 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25' 
                : 'text-purple-300 hover:text-white hover:bg-purple-500/20'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="text-white">
        <h2 className="text-2xl font-bold mb-4">Dashboard Content</h2>
        <p>Active tab: {activeTab}</p>
        <p>UI is working! Data will be added next.</p>
      </div>
    </div>
  );
}