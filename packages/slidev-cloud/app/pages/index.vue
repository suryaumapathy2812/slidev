<script setup lang="ts">
const { isAuthenticated, isLoading } = useAuth()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Navigation -->
    <nav class="p-6 flex justify-between items-center max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Slidev Cloud
      </h1>
      <div class="flex items-center gap-4">
        <template v-if="!isLoading">
          <template v-if="!isAuthenticated">
            <NuxtLink to="/login" class="btn">
              Login
            </NuxtLink>
            <NuxtLink to="/signup" class="btn-primary">
              Sign Up
            </NuxtLink>
          </template>
          <NuxtLink v-else to="/dashboard" class="btn-primary">
            Dashboard
          </NuxtLink>
        </template>
      </div>
    </nav>

    <!-- Hero Section -->
    <main class="max-w-6xl mx-auto px-6 py-20">
      <div class="text-center">
        <h2 class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Create Beautiful<br>
          <span class="text-blue-500">Presentations</span>
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
          Write in Markdown, present anywhere. Build stunning presentations with the power of Slidev, now in the cloud.
        </p>
        <div class="flex gap-4 justify-center">
          <NuxtLink to="/signup" class="btn-primary text-lg px-8 py-3">
            Get Started Free
          </NuxtLink>
          <a
            href="https://sli.dev"
            target="_blank"
            class="btn text-lg px-8 py-3"
          >
            Learn More
          </a>
        </div>
      </div>

      <!-- Features -->
      <div class="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="card p-6 text-center">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span class="i-carbon-document text-2xl text-blue-500" />
          </div>
          <h3 class="text-lg font-semibold mb-2">
            Markdown-Powered
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Write your slides in Markdown with full syntax highlighting and live preview.
          </p>
        </div>

        <div class="card p-6 text-center">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span class="i-carbon-share text-2xl text-green-500" />
          </div>
          <h3 class="text-lg font-semibold mb-2">
            Instant Publishing
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Publish your presentations with one click and share them anywhere.
          </p>
        </div>

        <div class="card p-6 text-center">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span class="i-carbon-presenter-mode text-2xl text-purple-500" />
          </div>
          <h3 class="text-lg font-semibold mb-2">
            Presenter Mode
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Present with speaker notes, timer, and next slide preview.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
