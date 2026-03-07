import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SCIMap from '@/components/Map'

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

        <Tabs defaultValue="cancelled" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col w-full">
          {/* Navigation Tabs */}
          <TabsList className="w-full justify-start rounded-none border-b border-gray-200 bg-gray-50/50 p-0 h-auto flex overflow-x-auto shrink-0">
            <TabsTrigger
              value="cancelled"
              className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 data-[state=active]:bg-blue-50/50 flex-1 rounded-none shadow-none data-[state=active]:shadow-none"
            >
              Cancelled & Frozen
            </TabsTrigger>
            <TabsTrigger
              value="indirect"
              className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 data-[state=active]:bg-blue-50/50 flex-1 rounded-none shadow-none data-[state=active]:shadow-none"
            >
              Indirect Costs
            </TabsTrigger>
            <TabsTrigger
              value="fy2026"
              className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 data-[state=active]:bg-blue-50/50 flex-1 rounded-none shadow-none data-[state=active]:shadow-none"
            >
              Proposed FY2026
            </TabsTrigger>
          </TabsList>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-white relative">
            <TabsContent value="cancelled" className="mt-0 outline-none space-y-4 animate-in fade-in duration-300">
                <h2 className="text-lg font-semibold text-gray-800">Cancelled and Frozen Grants</h2>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 shadow-sm">
                  Tracking NIH grants that have been cancelled or frozen based on the Grant Watch database.
                </div>
                <div className="h-40 bg-gray-100 rounded-lg border border-gray-200 animate-pulse flex items-center justify-center">
                  <span className="text-gray-400 font-medium text-sm">Data visualization placeholder</span>
                </div>
            </TabsContent>

            <TabsContent value="indirect" className="mt-0 outline-none space-y-4 animate-in fade-in duration-300">
                <h2 className="text-lg font-semibold text-gray-800">15% Indirect Cost Cap Impact</h2>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 shadow-sm">
                  Estimating the future impact of proposed changes capping indirect funding costs.
                </div>
                <div className="h-40 bg-gray-100 rounded-lg border border-gray-200 animate-pulse flex items-center justify-center">
                  <span className="text-gray-400 font-medium text-sm">Data visualization placeholder</span>
                </div>
            </TabsContent>

            <TabsContent value="fy2026" className="mt-0 outline-none space-y-4 animate-in fade-in duration-300">
                <h2 className="text-lg font-semibold text-gray-800">Proposed FY2026 Budget</h2>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-800 shadow-sm">
                  Comparing the proposed NIH FY 2026 budget to FY2024 to estimate proportion of funding lost.
                </div>
                <div className="h-40 bg-gray-100 rounded-lg border border-gray-200 animate-pulse flex items-center justify-center">
                  <span className="text-gray-400 font-medium text-sm">Data visualization placeholder</span>
                </div>
            </TabsContent>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Filter by State/District</h3>
              <Select defaultValue="all">
                <SelectTrigger className="w-full bg-white transition-shadow">
                  <SelectValue placeholder="Select a district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All US Districts</SelectItem>
                  <SelectItem value="ca">California</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="tx">Texas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Tabs>
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-slate-100 relative w-full h-full overflow-hidden">
        <SCIMap />

        {/* Map Legend Overlay */}
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
