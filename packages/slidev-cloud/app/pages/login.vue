<script setup lang="ts">
const { signIn, isAuthenticated } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// Redirect if already authenticated
watch(isAuthenticated, (value) => {
  if (value) {
    router.push('/dashboard')
  }
}, { immediate: true })

async function handleSubmit() {
  error.value = ''
  loading.value = true

  try {
    const result = await signIn(email.value, password.value)
    if (result.error) {
      error.value = result.error.message || 'Login failed'
    }
    else {
      router.push('/dashboard')
    }
  }
  catch (e: any) {
    error.value = e.message || 'An error occurred'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="card max-w-md w-full p-8">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="text-2xl font-bold text-gray-900 dark:text-white">
          Slidev Cloud
        </NuxtLink>
        <h1 class="mt-4 text-xl font-semibold">
          Welcome back
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Sign in to your account
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <UiInput
          v-model="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          :disabled="loading"
        />

        <UiInput
          v-model="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          :disabled="loading"
        />

        <p v-if="error" class="text-sm text-red-500 text-center">
          {{ error }}
        </p>

        <UiButton
          type="submit"
          variant="primary"
          size="lg"
          class="w-full"
          :loading="loading"
          :disabled="!email || !password"
        >
          Sign In
        </UiButton>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?
        <NuxtLink to="/signup" class="text-blue-500 hover:underline">
          Sign up
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
