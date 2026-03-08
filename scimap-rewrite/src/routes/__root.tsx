import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col w-full bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <div className="font-bold text-xl text-blue-900 tracking-tight">SCIMaP</div>
          <div className="hidden md:block text-sm text-gray-500 font-medium ml-2">
            Science & Community Impacts Mapping Project
          </div>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <button className="text-gray-600 hover:text-gray-900 transition-colors">Methods</button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">About</button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">Report Issues</button>
        </nav>
      </header>

      <main className="flex-1 flex flex-col w-full relative overflow-hidden">
        <Outlet />
      </main>
    </div>
  ),
})
