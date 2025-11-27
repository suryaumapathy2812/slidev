export default defineNuxtRouteMiddleware(async (_to) => {
  const { isAuthenticated, isLoading } = useAuth()

  // Wait for auth to load
  if (isLoading.value) {
    // Allow navigation, auth will redirect if needed
    return
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
