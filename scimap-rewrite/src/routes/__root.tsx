import { useState, useRef, useEffect } from 'react'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { Menu, X, ChevronDown } from 'lucide-react'

function MapsDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 transition-colors hover:text-gray-300"
      >
        Maps <ChevronDown className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/10">
          <Link
            to="/map"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Baseline Funding
          </Link>
          <Link
            to="/grants"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Grant Disruptions
          </Link>
          <Link
            to="/fy26"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Award Funding Changes
          </Link>
        </div>
      )}
    </div>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-brand-blue px-4 py-3 md:px-6 md:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <div className="text-xl font-bold tracking-tight text-white md:text-2xl">SCIMaP</div>
          <div className="hidden text-[15px] font-medium text-gray-200 md:block">
            Science & Community Impacts Mapping Project
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-[15px] font-semibold text-white md:flex">
          <Link to="/" className="transition-colors hover:text-gray-300">
            Home
          </Link>
          <MapsDropdown />
          <Link to="/news" className="transition-colors hover:text-gray-300">
            News
          </Link>
          <Link to="/insights" className="transition-colors hover:text-gray-300">
            Insights
          </Link>
          <Link to="/about" className="transition-colors hover:text-gray-300">
            About
          </Link>
          <Link to="/methodology" className="transition-colors hover:text-gray-300">
            Methodology
          </Link>
          <Link to="/contact" className="transition-colors hover:text-gray-300">
            Contact Us
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="p-1 text-white md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="mt-3 flex flex-col gap-3 border-t border-white/20 pt-3 text-[15px] font-semibold text-white md:hidden">
          <Link to="/" className="text-left transition-colors hover:text-gray-300" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <div className="text-gray-300">Maps</div>
          <Link to="/map" className="pl-3 text-left transition-colors hover:text-gray-300" onClick={() => setMenuOpen(false)}>
            Baseline Funding
          </Link>
          <Link to="/grants" className="pl-3 text-left transition-colors hover:text-gray-300" onClick={() => setMenuOpen(false)}>
            Grant Disruptions
          </Link>
          <Link to="/fy26" className="pl-3 text-left transition-colors hover:text-gray-300" onClick={() => setMenuOpen(false)}>
            Award Funding Changes
          </Link>
          <Link to="/news" className="text-left transition-colors hover:text-gray-300" onClick={() => setMenuOpen(false)}>
            News
          </Link>
          <Link to="/insights" className="text-left transition-colors hover:text-gray-300" onClick={() => setMenuOpen(false)}>
            Insights
          </Link>
          <Link to="/about" className="text-left transition-colors hover:text-gray-300" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <Link to="/methodology" className="text-left transition-colors hover:text-gray-300" onClick={() => setMenuOpen(false)}>
            Methodology
          </Link>
          <Link to="/contact" className="text-left transition-colors hover:text-gray-300" onClick={() => setMenuOpen(false)}>
            Contact Us
          </Link>
        </nav>
      )}
    </header>
  )
}

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <Header />

      <main className="relative flex w-full flex-1 flex-col overflow-auto">
        <Outlet />
      </main>

      <footer className="border-t border-brand-blue-light/30 bg-brand-blue-dark px-4 pb-8 pt-12 text-white md:px-6 md:pt-16">
        <div className="mx-auto flex max-w-7xl flex-col space-y-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="text-lg font-bold tracking-tight">SCIMaP</div>
              <p className="pr-8 text-sm leading-relaxed text-gray-300">
                Tracking federal cuts to science and their impact on communities.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Navigation</h4>
              <ul className="flex flex-col space-y-3 text-sm text-gray-300">
                <li>
                  <Link to="/about" className="transition-colors hover:text-brand-yellow">
                    About the Project
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="transition-colors hover:text-brand-yellow">
                    News
                  </Link>
                </li>
                <li>
                  <Link to="/insights" className="transition-colors hover:text-brand-yellow">
                    Insights
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Resources</h4>
              <ul className="flex flex-col space-y-3 text-sm text-gray-300">
                <li>
                  <a href="/" className="transition-colors hover:text-brand-yellow">
                    Impact Map
                  </a>
                </li>
                <li>
                  <Link to="/insights" className="transition-colors hover:text-brand-yellow">
                    Insights
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="transition-colors hover:text-brand-yellow">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Get in Touch</h4>
              <ul className="flex flex-col space-y-1 text-sm text-gray-300">
                <li>Press Inquiries: press@scienceimpacts.org</li>
                <li>Other: contact@scienceimpacts.org</li>
              </ul>
              <div className="flex gap-4 pt-4">
                <a
                  href="/"
                  className="text-gray-300 transition-colors hover:text-white"
                  aria-label="Bluesky"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.905C2.566 1.127 1.816 1.494 1.196 1.889c-.58.37-1.196 1.258-1.196 2.502 0 1.253.284 3.778.682 4.965.732 2.186 3.12 3.292 5.565 3.33-2.738.163-5.263 1.09-5.112 3.565.176 2.872 3.843 5.378 7.37 5.378 2.375 0 3.5-1.298 3.5-1.298s1.125 1.298 3.5 1.298c3.527 0 7.194-2.506 7.37-5.378.15-2.475-2.374-3.402-5.112-3.565 2.445-.038 4.833-1.144 5.565-3.33.398-1.187.682-3.712.682-4.965 0-1.244-.616-2.132-1.196-2.502-.62-.395-1.37-.762-4.006 1.006-2.752 1.852-5.711 5.791-6.798 7.905z" />
                  </svg>
                </a>
                <a
                  href="/"
                  className="text-gray-300 transition-colors hover:text-white"
                  aria-label="Instagram"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="/"
                  className="text-gray-300 transition-colors hover:text-white"
                  aria-label="Map/Book"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-brand-blue-light/50 pt-8 text-center text-sm text-gray-300">
            Science & Community Impact Mapping Project (SCIMaP), University of Maryland, College of
            Math & Natural Sciences, College Park Maryland
          </div>
        </div>
      </footer>
    </div>
  ),
})
