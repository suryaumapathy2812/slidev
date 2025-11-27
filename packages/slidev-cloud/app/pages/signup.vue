<script setup lang="ts">
const { signUp, isAuthenticated } = useAuth()
const router = useRouter()

const name = ref('')
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
    const result = await signUp(email.value, password.value, name.value)
    if (result.error) {
      error.value = result.error.message || 'Signup failed'
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
          Create your account
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Start creating presentations
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <UiInput
          v-model="name"
          type="text"
          label="Name"
          placeholder="Your name"
          :disabled="loading"
        />

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
          placeholder="Create a password"
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
          :disabled="!name || !email || !password"
        >
          Create Account
        </UiButton>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?
        <NuxtLink to="/login" class="text-blue-500 hover:underline">
          Sign in
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
