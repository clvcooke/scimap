import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col w-full bg-white">
      <header className="bg-brand-blue px-6 py-4 flex items-center justify-between sticky top-0 z-50">
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

      <footer className="bg-brand-blue-dark text-white pt-16 pb-8 px-6 border-t border-brand-blue-light/30">
        <div className="max-w-7xl mx-auto flex flex-col space-y-12">
          {/* Top 4-column structure */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Project Info */}
            <div className="space-y-4">
              <div className="font-bold text-lg tracking-tight">SCIMaP</div>
              <p className="text-sm text-gray-300 leading-relaxed pr-8">
                Tracking federal cuts to science and their impact on communities.
              </p>
            </div>

            {/* Navigation */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-white">Navigation</h4>
              <ul className="space-y-3 flex flex-col text-sm text-gray-300">
                <li>
                  <a href="/" className="hover:text-brand-yellow transition-colors">
                    About the Project
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-brand-yellow transition-colors">
                    News
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-brand-yellow transition-colors">
                    Insights
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-white">Resources</h4>
              <ul className="space-y-3 flex flex-col text-sm text-gray-300">
                <li>
                  <a href="/" className="hover:text-brand-yellow transition-colors">
                    Impact Map
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-brand-yellow transition-colors">
                    Insights
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-brand-yellow transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Get In Touch */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-white">Get in Touch</h4>
              <ul className="space-y-1 flex flex-col text-sm text-gray-300">
                <li>
                  Press Inquiries: press@scienceimpacts.org
                </li>
                <li>
                  Other: contact@scienceimpacts.org
                </li>
              </ul>
              <div className="flex gap-4 pt-4">
                {/* Social Placeholder 1 */}
                <a
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Bluesky"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.905C2.566 1.127 1.816 1.494 1.196 1.889c-.58.37-1.196 1.258-1.196 2.502 0 1.253.284 3.778.682 4.965.732 2.186 3.12 3.292 5.565 3.33-2.738.163-5.263 1.09-5.112 3.565.176 2.872 3.843 5.378 7.37 5.378 2.375 0 3.5-1.298 3.5-1.298s1.125 1.298 3.5 1.298c3.527 0 7.194-2.506 7.37-5.378.15-2.475-2.374-3.402-5.112-3.565 2.445-.038 4.833-1.144 5.565-3.33.398-1.187.682-3.712.682-4.965 0-1.244-.616-2.132-1.196-2.502-.62-.395-1.37-.762-4.006 1.006-2.752 1.852-5.711 5.791-6.798 7.905z"/>
                  </svg>
                </a>
                {/* Social Placeholder 2 */}
                <a
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                {/* Social Placeholder 3 */}
                <a
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Map/Book"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-brand-blue-light/50 pt-8 mt-12 text-center text-sm text-gray-300">
            Science & Community Impact Mapping Project (SCIMaP), University of Maryland, College of Math & Natural Sciences, College Park Maryland
          </div>
        </div>
      </footer>
    </div>
  ),
})
