import { createAuthClient } from 'better-auth/vue'

export function useAuth() {
  // Only create client on client-side
  const authClient = import.meta.client
    ? createAuthClient({
        baseURL: window.location.origin,
      })
    : null

  // Create reactive refs for SSR compatibility
  const user = ref<any>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(true)

  // Session handling
  const session = authClient?.useSession()

  // Watch session changes on client
  if (import.meta.client && session) {
    watch(
      () => session.value,
      (newSession) => {
        user.value = newSession?.data?.user || null
        isAuthenticated.value = !!newSession?.data?.user
        isLoading.value = newSession?.isPending ?? false
      },
      { immediate: true },
    )
  }

  const signIn = async (email: string, password: string) => {
    if (!authClient)
      return { error: { message: 'Auth not available' } }
    return await authClient.signIn.email({
      email,
      password,
    })
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (!authClient)
      return { error: { message: 'Auth not available' } }
    return await authClient.signUp.email({
      email,
      password,
      name,
    })
  }

  const signOut = async () => {
    if (!authClient)
      return
    return await authClient.signOut()
  }

  return {
    session,
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
  }
}
