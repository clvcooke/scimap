import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col w-full bg-white">
      <header className="bg-[#003366] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-baseline gap-3">
          {/* Logo Placeholder */}
          <div className="font-bold text-2xl text-white tracking-tight">SCIMaP</div>
          <div className="hidden md:block text-[15px] text-gray-200 font-medium">
            Science & Community Impacts Mapping Project
          </div>
        </div>
        <nav className="flex items-center gap-6 text-[15px] font-semibold text-white">
          <button className="hover:text-gray-300 transition-colors">Methods</button>
          <button className="hover:text-gray-300 transition-colors">About</button>
          <button className="hover:text-gray-300 transition-colors">Report Issues</button>
        </nav>
      </header>

      <main className="flex-1 flex flex-col w-full relative overflow-auto">
        <Outlet />
      </main>
    </div>
  ),
})
