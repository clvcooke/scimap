import { useState } from 'react'
import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { Menu, X, ChevronDown } from 'lucide-react'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileImpactMapsOpen, setMobileImpactMapsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-brand-blue px-4 py-3 lg:px-6 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-white lg:text-2xl hover:text-gray-200 transition-colors"
          >
            SCIMaP
          </Link>
          <div className="hidden text-[15px] font-medium text-gray-200 lg:block">
            Science & Community Impacts Mapping Project
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-[15px] font-semibold text-white lg:flex">
          <Link to="/" className="transition-colors hover:text-brand-yellow">
            Home
          </Link>

          <div className="group relative">
            <button className="flex items-center gap-1 transition-colors hover:text-brand-yellow group-hover:text-brand-yellow pb-4 -mb-4 pt-4 -mt-4">
              Impact Maps <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute left-0 top-full mt-2 hidden w-56 rounded-md bg-white p-2 shadow-lg ring-1 ring-black/5 group-hover:block">
              <Link
                to="/map"
                className="block rounded-sm px-4 py-2 text-sm text-brand-blue hover:bg-gray-100 hover:text-brand-blue-dark"
              >
                Baseline Funding
              </Link>
              <Link
                to="/map"
                className="block rounded-sm px-4 py-2 text-sm text-brand-blue hover:bg-gray-100 hover:text-brand-blue-dark"
              >
                Grant Disruptions
              </Link>
              <Link
                to="/map"
                className="block rounded-sm px-4 py-2 text-sm text-brand-blue hover:bg-gray-100 hover:text-brand-blue-dark"
              >
                Award Funding Changes
              </Link>
            </div>
          </div>

          <Link to="/" className="transition-colors hover:text-brand-yellow">
            Methodology
          </Link>
          <Link to="/" className="transition-colors hover:text-brand-yellow">
            Insights
          </Link>
          <Link to="/" className="transition-colors hover:text-brand-yellow">
            News
          </Link>
          <Link to="/" className="transition-colors hover:text-brand-yellow">
            About Us
          </Link>
          <Link to="/" className="transition-colors hover:text-brand-yellow">
            Contact
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="p-1 text-white lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="mt-3 flex flex-col gap-3 border-t border-white/20 pt-3 text-[15px] font-semibold text-white lg:hidden">
          <Link to="/" className="text-left transition-colors hover:text-brand-yellow">
            Home
          </Link>

          <div className="flex flex-col">
            <button
              className="flex items-center justify-between text-left transition-colors hover:text-brand-yellow"
              onClick={() => setMobileImpactMapsOpen(!mobileImpactMapsOpen)}
            >
              Impact Maps{' '}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${mobileImpactMapsOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {mobileImpactMapsOpen && (
              <div className="mt-2 flex flex-col gap-2 pl-4 text-sm text-gray-200">
                <Link to="/map" className="transition-colors hover:text-brand-yellow">
                  Baseline Funding
                </Link>
                <Link to="/map" className="transition-colors hover:text-brand-yellow">
                  Grant Disruptions
                </Link>
                <Link to="/map" className="transition-colors hover:text-brand-yellow">
                  Award Funding Changes
                </Link>
              </div>
            )}
          </div>

          <Link to="/" className="text-left transition-colors hover:text-brand-yellow">
            Methodology
          </Link>
          <Link to="/" className="text-left transition-colors hover:text-brand-yellow">
            Insights
          </Link>
          <Link to="/" className="text-left transition-colors hover:text-brand-yellow">
            News
          </Link>
          <Link to="/" className="text-left transition-colors hover:text-brand-yellow">
            About Us
          </Link>
          <Link to="/" className="text-left transition-colors hover:text-brand-yellow">
            Contact
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
                  <a href="/" className="transition-colors hover:text-brand-yellow">
                    About the Project
                  </a>
                </li>
                <li>
                  <a href="/" className="transition-colors hover:text-brand-yellow">
                    News
                  </a>
                </li>
                <li>
                  <a href="/" className="transition-colors hover:text-brand-yellow">
                    Insights
                  </a>
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
                  <a href="/" className="transition-colors hover:text-brand-yellow">
                    Insights
                  </a>
                </li>
                <li>
                  <a href="/" className="transition-colors hover:text-brand-yellow">
                    Contact Us
                  </a>
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
