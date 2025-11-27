import { auth } from '~~/server/lib/auth'

export default defineEventHandler(async (event) => {
  // Skip auth check for public routes and auth routes
  const publicPaths = ['/api/auth', '/api/public']
  const path = event.path || ''

  if (publicPaths.some(p => path.startsWith(p))) {
    return
  }

  // Get session for API routes
  if (path.startsWith('/api/')) {
    try {
      // Convert H3 headers to standard Headers object
      const headers = new Headers()
      const rawHeaders = getHeaders(event)
      for (const [key, value] of Object.entries(rawHeaders)) {
        if (value) {
          headers.set(key, value)
        }
      }

      const session = await auth.api.getSession({
        headers,
      })
      event.context.session = session
    }
    catch (error) {
      console.error('Auth middleware error:', error)
      event.context.session = null
    }
  }
})
