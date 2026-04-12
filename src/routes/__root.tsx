import { useState, useRef, useEffect } from 'react'
import { createRootRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import { Menu, X, ChevronDown } from 'lucide-react'
import { getPage } from '@/lib/content'
import ShareMenu from '@/components/ShareMenu'

const FOOTER = getPage('footer').attrs

const navLinkBase = 'pb-1 border-b-2 transition-colors cursor-pointer'
const navLinkActive = { className: `${navLinkBase} border-brand-orange` }
const navLinkInactive = {
  className: `${navLinkBase} border-transparent hover:border-brand-blue-light/50 hover:text-brand-blue-light`,
}

function MapsDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const isMapActive = ['/map', '/maps', '/grants', '/fy27', '/idc'].some((p) => pathname.startsWith(p))

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && e.target instanceof Node && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex cursor-pointer items-center gap-1 ${navLinkBase} ${isMapActive ? 'border-brand-orange' : 'border-transparent hover:text-brand-blue-light'}`}
      >
        Impact Maps <ChevronDown className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/10">
          <Link
            to="/maps"
            className="block border-b border-gray-100 px-4 py-2 text-sm font-medium text-brand-blue hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            All Maps
          </Link>
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
            Grant Terminations
          </Link>
          <Link
            to="/fy27"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            FY27 Budget Impact
          </Link>
          <Link
            to="/idc"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Indirect Costs
          </Link>
        </div>
      )}
    </div>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white px-4 py-3 md:px-6 md:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <Link to="/" className="text-xl font-bold tracking-tight text-brand-blue md:text-2xl">
            SCIMaP
          </Link>
          <div className="hidden text-[15px] font-medium text-gray-500 md:block">
            Science & Community Impacts Mapping Project
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-[15px] font-medium text-brand-blue md:flex">
          <Link
            to="/"
            activeProps={navLinkActive}
            inactiveProps={navLinkInactive}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <MapsDropdown />
          <Link to="/methodology" activeProps={navLinkActive} inactiveProps={navLinkInactive}>
            Methodology
          </Link>
          <Link to="/insights" activeProps={navLinkActive} inactiveProps={navLinkInactive}>
            Insights
          </Link>
          <Link to="/news" activeProps={navLinkActive} inactiveProps={navLinkInactive}>
            News
          </Link>
          <Link to="/about" activeProps={navLinkActive} inactiveProps={navLinkInactive}>
            About Us
          </Link>
          <Link to="/take-action" activeProps={navLinkActive} inactiveProps={navLinkInactive}>
            Take Action
          </Link>
          <Link to="/contact" activeProps={navLinkActive} inactiveProps={navLinkInactive}>
            Contact
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="p-1 text-brand-blue md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="mt-3 flex flex-col gap-3 border-t border-gray-200 pt-3 text-[15px] font-medium text-brand-blue md:hidden">
          <Link
            to="/"
            className="text-left transition-colors hover:text-brand-blue-light"
            activeProps={{ className: 'text-left border-l-2 border-brand-orange pl-2' }}
            activeOptions={{ exact: true }}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/maps"
            className="text-left font-medium transition-colors hover:text-brand-blue-light"
            activeProps={{ className: 'text-left border-l-2 border-brand-orange pl-2' }}
            onClick={() => setMenuOpen(false)}
          >
            All Maps
          </Link>
          <Link
            to="/map"
            className="pl-3 text-left transition-colors hover:text-brand-blue-light"
            activeProps={{ className: 'pl-3 text-left border-l-2 border-brand-orange' }}
            onClick={() => setMenuOpen(false)}
          >
            Baseline Funding
          </Link>
          <Link
            to="/grants"
            className="pl-3 text-left transition-colors hover:text-brand-blue-light"
            activeProps={{ className: 'pl-3 text-left border-l-2 border-brand-orange' }}
            onClick={() => setMenuOpen(false)}
          >
            Grant Terminations
          </Link>
          <Link
            to="/fy27"
            className="pl-3 text-left transition-colors hover:text-brand-blue-light"
            activeProps={{ className: 'pl-3 text-left border-l-2 border-brand-orange' }}
            onClick={() => setMenuOpen(false)}
          >
            FY27 Budget Impact
          </Link>
          <Link
            to="/idc"
            className="pl-3 text-left transition-colors hover:text-brand-blue-light"
            activeProps={{ className: 'pl-3 text-left border-l-2 border-brand-orange' }}
            onClick={() => setMenuOpen(false)}
          >
            Indirect Costs
          </Link>

          <Link
            to="/insights"
            className="text-left transition-colors hover:text-brand-blue-light"
            activeProps={{ className: 'text-left border-l-2 border-brand-orange pl-2' }}
            onClick={() => setMenuOpen(false)}
          >
            Insights
          </Link>
          <Link
            to="/news"
            className="text-left transition-colors hover:text-brand-blue-light"
            activeProps={{ className: 'text-left border-l-2 border-brand-orange pl-2' }}
            onClick={() => setMenuOpen(false)}
          >
            News
          </Link>
          <Link
            to="/about"
            className="text-left transition-colors hover:text-brand-blue-light"
            activeProps={{ className: 'text-left border-l-2 border-brand-orange pl-2' }}
            onClick={() => setMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            to="/methodology"
            className="text-left transition-colors hover:text-brand-blue-light"
            activeProps={{ className: 'text-left border-l-2 border-brand-orange pl-2' }}
            onClick={() => setMenuOpen(false)}
          >
            Methodology
          </Link>
          <Link
            to="/take-action"
            className="text-left transition-colors hover:text-brand-blue-light"
            activeProps={{ className: 'text-left border-l-2 border-brand-orange pl-2' }}
            onClick={() => setMenuOpen(false)}
          >
            Take Action
          </Link>
          <Link
            to="/contact"
            className="text-left transition-colors hover:text-brand-blue-light"
            activeProps={{ className: 'text-left border-l-2 border-brand-orange pl-2' }}
            onClick={() => setMenuOpen(false)}
          >
            Contact Us
          </Link>
        </nav>
      )}
    </header>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <ScrollToTop />
      <Header />

      <main className="relative flex w-full flex-1 flex-col">
        <Outlet />
      </main>

      <footer className="border-t border-brand-blue-light/30 bg-brand-blue-dark px-4 pb-4 pt-6 text-white md:px-6 md:pt-8">
        <div className="mx-auto flex max-w-7xl flex-col space-y-3">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/logo_v3_white-01.png" alt="SCIMaP" className="h-12 w-12" />
                <div className="text-lg font-bold tracking-tight">{FOOTER.site_name}</div>
              </div>
              <p className="pr-8 text-sm leading-relaxed text-gray-300">{FOOTER.tagline}</p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Get in Touch</h4>
              <ul className="flex flex-col space-y-1 text-sm text-gray-300">
                <li>Press Inquiries: {FOOTER.press_email}</li>
                <li>Other: {FOOTER.contact_email}</li>
              </ul>
              <div className="flex items-center gap-4 pt-4">
                <ShareMenu
                  shareUrl="https://scienceimpacts.org"
                  shareTitle="SCIMaP — Science & Community Impacts Mapping Project"
                  dropUp
                  className="[&_button]:text-gray-300 [&_button]:hover:text-white [&_button]:bg-transparent [&_button]:shadow-none"
                />
                <a
                  href="https://bsky.app/profile/scienceimpacts.org"
                  className="text-gray-300 transition-colors hover:text-white"
                  aria-label="Bluesky"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.905C2.566 1.127 1.816 1.494 1.196 1.889c-.58.37-1.196 1.258-1.196 2.502 0 1.253.284 3.778.682 4.965.732 2.186 3.12 3.292 5.565 3.33-2.738.163-5.263 1.09-5.112 3.565.176 2.872 3.843 5.378 7.37 5.378 2.375 0 3.5-1.298 3.5-1.298s1.125 1.298 3.5 1.298c3.527 0 7.194-2.506 7.37-5.378.15-2.475-2.374-3.402-5.112-3.565 2.445-.038 4.833-1.144 5.565-3.33.398-1.187.682-3.712.682-4.965 0-1.244-.616-2.132-1.196-2.502-.62-.395-1.37-.762-4.006 1.006-2.752 1.852-5.711 5.791-6.798 7.905z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/science_impacts"
                  target="_blank"
                  rel="noopener noreferrer"
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
                  href="https://www.linkedin.com/company/science-community-impacts-mapping-project/about/"
                  className="text-gray-300 transition-colors hover:text-white"
                  aria-label="LinkedIn"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-brand-blue-light/50 pt-4 text-center text-sm text-gray-300">
            {FOOTER.org_line}
          </div>
        </div>
      </footer>
    </div>
  ),
})
