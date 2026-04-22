import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { initAnalytics } from './lib/analytics'
import './index.css'

// Create a new router instance
const router = createRouter({ routeTree })

initAnalytics(router)

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  // Remove StrictMode to see if it's double rendering an issue with DeckGL
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>,
  // </StrictMode>,
)
