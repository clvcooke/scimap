import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [activeTab, setActiveTab] = useState('cancelled')

  return (
    <div className="flex flex-col md:flex-row h-full absolute inset-0">
      {/* Left Sidebar */}
      <div className="w-full md:w-96 lg:w-[400px] bg-white border-r border-gray-200 flex flex-col h-full shadow-lg z-10 overflow-hidden relative">
        <div className="p-4 border-b border-gray-100 flex-none bg-white">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Funding Impacts by Congressional District</h1>
          <p className="text-sm text-gray-600">
            Explore how proposed funding cuts impact specific regions and communities.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto shrink-0 bg-gray-50/50">
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-1 ${
              activeTab === 'cancelled' ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
            }`}
          >
            Cancelled & Frozen
          </button>
          <button
            onClick={() => setActiveTab('indirect')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-1 ${
              activeTab === 'indirect' ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
            }`}
          >
            Indirect Costs
          </button>
          <button
            onClick={() => setActiveTab('fy2026')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-1 ${
              activeTab === 'fy2026' ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
            }`}
          >
            Proposed FY2026
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-white relative">
          {activeTab === 'cancelled' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h2 className="text-lg font-semibold text-gray-800">Cancelled and Frozen Grants</h2>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 shadow-sm">
                Tracking NIH grants that have been cancelled or frozen based on the Grant Watch database.
              </div>
              <div className="h-40 bg-gray-100 rounded-lg border border-gray-200 animate-pulse flex items-center justify-center">
                <span className="text-gray-400 font-medium text-sm">Data visualization placeholder</span>
              </div>
            </div>
          )}
          {activeTab === 'indirect' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h2 className="text-lg font-semibold text-gray-800">15% Indirect Cost Cap Impact</h2>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 shadow-sm">
                Estimating the future impact of proposed changes capping indirect funding costs.
              </div>
              <div className="h-40 bg-gray-100 rounded-lg border border-gray-200 animate-pulse flex items-center justify-center">
                <span className="text-gray-400 font-medium text-sm">Data visualization placeholder</span>
              </div>
            </div>
          )}
          {activeTab === 'fy2026' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h2 className="text-lg font-semibold text-gray-800">Proposed FY2026 Budget</h2>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-800 shadow-sm">
                Comparing the proposed NIH FY 2026 budget to FY2024 to estimate proportion of funding lost.
              </div>
              <div className="h-40 bg-gray-100 rounded-lg border border-gray-200 animate-pulse flex items-center justify-center">
                <span className="text-gray-400 font-medium text-sm">Data visualization placeholder</span>
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Filter by State/District</h3>
            <select className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow">
              <option>All US Districts</option>
              <option>California</option>
              <option>New York</option>
              <option>Texas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-slate-100 relative w-full h-full">
        {/* Placeholder for Map component */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-300 max-w-sm">
            <div className="w-16 h-16 bg-slate-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-slate-700">Map Loading</h2>
            <p className="text-slate-500 mt-2 text-sm">The interactive map layer will be initialized here.</p>
          </div>
        </div>

        {/* Map Legend Overlay Placeholder */}
        <div className="absolute bottom-6 right-6 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-10 w-64 hidden sm:block">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500/80 border border-red-600"></div>
              <span className="text-sm text-gray-700">High Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-400/80 border border-orange-500"></div>
              <span className="text-sm text-gray-700">Medium Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-300/80 border border-yellow-400"></div>
              <span className="text-sm text-gray-700">Low Impact</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
