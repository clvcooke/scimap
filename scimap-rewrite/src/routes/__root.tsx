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

      <footer className="bg-[#002147] text-white pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col space-y-12">
          {/* Top 4-column structure */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Project Info */}
            <div className="space-y-4">
              <div className="font-bold text-2xl tracking-tight">SCIMaP</div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Mapping the nationwide impacts of proposed federal funding cuts to science,
                research, and local communities.
              </p>
            </div>

            {/* Navigation */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-white">Navigation</h4>
              <ul className="space-y-2 flex flex-col text-sm text-gray-300">
                <li>
                  <a href="/" className="hover:text-[#FFB81C] transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-[#FFB81C] transition-colors">
                    News
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-[#FFB81C] transition-colors">
                    Insights
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-white">Resources</h4>
              <ul className="space-y-2 flex flex-col text-sm text-gray-300">
                <li>
                  <a href="/" className="hover:text-[#FFB81C] transition-colors">
                    Impact Map
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-[#FFB81C] transition-colors">
                    Data Methodology
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-[#FFB81C] transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Get In Touch */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-white">Get In Touch</h4>
              <ul className="space-y-2 flex flex-col text-sm text-gray-300">
                <li>
                  <a
                    href="mailto:press@scienceimpacts.org"
                    className="hover:text-[#FFB81C] transition-colors flex items-center gap-2"
                  >
                    Press Inquiries
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@scienceimpacts.org"
                    className="hover:text-[#FFB81C] transition-colors flex items-center gap-2"
                  >
                    General Contact
                  </a>
                </li>
              </ul>
              <div className="flex gap-4 pt-2">
                {/* Social Placeholder 1 */}
                <a
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                {/* Social Placeholder 2 */}
                <a
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700/50 pt-8 mt-12 text-center text-xs text-gray-400 flex flex-col gap-2">
            <p>
              &copy; {new Date().getFullYear()} SCIMaP - Science & Community Impacts Mapping
              Project. All rights reserved.
            </p>
            <p>University of Maryland</p>
          </div>
        </div>
      </footer>
    </div>
  ),
})
