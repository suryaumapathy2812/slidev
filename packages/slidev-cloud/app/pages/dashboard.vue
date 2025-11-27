<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { user, signOut } = useAuth()

const { data: presentations, refresh, pending } = await useFetch('/api/presentations')

const showCreateModal = ref(false)

async function createPresentation(title: string) {
  try {
    const presentation = await $fetch('/api/presentations', {
      method: 'POST',
      body: { title },
    })
    showCreateModal.value = false
    navigateTo(`/edit/${presentation.id}`)
  }
  catch (err) {
    console.error('Failed to create presentation:', err)
  }
}

const showDeleteConfirm = ref<string | null>(null)

async function deletePresentation(id: string) {
  showDeleteConfirm.value = id
}

async function confirmDelete() {
  const id = showDeleteConfirm.value
  if (!id)
    return
  showDeleteConfirm.value = null

  try {
    await $fetch(`/api/presentations/${id}`, {
      method: 'DELETE',
    })
    await refresh()
  }
  catch (error) {
    console.error('Failed to delete presentation:', error)
  }
}

async function togglePublish(id: string) {
  try {
    await $fetch(`/api/presentations/${id}/publish`, {
      method: 'POST',
    })
    await refresh()
  }
  catch (error) {
    console.error('Failed to toggle publish:', error)
  }
}

async function handleSignOut() {
  await signOut()
  navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="text-xl font-bold text-gray-900 dark:text-white">
            Slidev Cloud
          </NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ user?.name || user?.email }}
          </span>
          <button
            class="btn text-sm"
            @click="handleSignOut"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-6 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">
          My Presentations
        </h1>
        <UiButton
          variant="primary"
          @click="showCreateModal = true"
        >
          <span class="i-carbon-add mr-2" />
          New Presentation
        </UiButton>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center py-20">
        <span class="i-carbon-loading animate-spin text-4xl text-gray-400" />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!presentations?.length"
        class="text-center py-20"
      >
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="i-carbon-document text-3xl text-gray-400" />
        </div>
        <h2 class="text-lg font-medium mb-2">
          No presentations yet
        </h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Create your first presentation to get started.
        </p>
        <UiButton
          variant="primary"
          @click="showCreateModal = true"
        >
          Create Presentation
        </UiButton>
      </div>

      <!-- Presentations Grid -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <DashboardPresentationCard
          v-for="p in presentations"
          :key="p.id"
          :presentation="p"
          @delete="deletePresentation"
          @publish="togglePublish"
        />
      </div>
    </main>

    <!-- Create Modal -->
    <DashboardCreateModal
      :open="showCreateModal"
      @close="showCreateModal = false"
      @create="createPresentation"
    />

    <!-- Delete Confirmation Modal -->
    <UiModal
      :open="!!showDeleteConfirm"
      title="Delete Presentation"
      @close="showDeleteConfirm = null"
    >
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Are you sure you want to delete this presentation? This action cannot be undone.
      </p>
      <div class="flex justify-end gap-2">
        <UiButton variant="ghost" @click="showDeleteConfirm = null">
          Cancel
        </UiButton>
        <UiButton variant="primary" class="bg-red-500 hover:bg-red-600" @click="confirmDelete">
          Delete
        </UiButton>
      </div>
    </UiModal>
  </div>
</template>
