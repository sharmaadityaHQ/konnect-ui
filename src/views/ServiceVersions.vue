<template>
  <div class="service-versions">
    <!-- Header -->
    <CatalogHeader />

    <!-- Main Content -->
    <div class="versions-content">
      <!-- Loading State -->
      <div
        v-if="loading"
        class="loading-state"
      >
        <div class="spinner" />
        <p>Loading versions...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="error-state"
      >
        <p>Failed to load service versions. Please try again.</p>
      </div>

      <!-- Versions List -->
      <template v-else-if="apiServiceData">
        <div class="versions-header">
          <h2 class="versions-title">
            Versions ({{ versions.length }})
          </h2>
        </div>

        <!-- Empty State -->
        <div
          v-if="versions.length === 0"
          class="empty-state"
        >
          <p>No versions available for this service.</p>
        </div>

        <!-- Versions List -->
        <div
          v-else
          class="versions-list"
        >
          <VersionCard
            v-for="version in versions"
            :key="version.id"
            :version="version"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { ApiService } from '@/types/service'
import VersionCard from '@/components/VersionCard.vue'
import CatalogHeader from '@/components/CatalogHeader.vue'

const route = useRoute()
const loading = ref(false)
const error = ref(false)
const apiServiceData = ref<ApiService | null>(null)

// Try to get API service data from router state first
const routerApiService = history.state.apiService as ApiService | undefined

// If we have data from router, use it immediately for instant display
if (routerApiService) {
  console.log('✅ Loaded from router state:', routerApiService.name, `(${routerApiService.versions.length} versions)`)
  apiServiceData.value = routerApiService
} else {
  console.log('ℹ️ No router state - will fetch from API')
}

// Get versions array enriched with serviceType for VersionCard component
const versions = computed(() => {
  if (!apiServiceData.value) {
    return []
  }
  return apiServiceData.value.versions.map(version => ({
    ...version,
    serviceType: apiServiceData.value!.type,
  }))
})

// Always fetch fresh data (silent refresh if we have cached data)
const fetchServiceData = async () => {
  try {
    // Only show loading spinner if we don't have cached data
    if (!apiServiceData.value) {
      loading.value = true
      console.log('🔄 Fetching service data from API...')
    } else {
      console.log('🔄 Fetching fresh data in background (silent refresh)...')
    }
    error.value = false

    const { data } = await axios.get<ApiService[]>('/api/services', {
      params: { q: route.params.id },
    })

    if (data && data.length > 0) {
      apiServiceData.value = data[0]
      console.log('✅ Fresh data loaded:', data[0].name, `(${data[0].versions.length} versions)`)
    } else {
      error.value = true
      console.error('❌ No service found with ID:', route.params.id)
    }
  } catch (err) {
    error.value = true
    console.error('❌ Failed to fetch service versions:', err)
  } finally {
    loading.value = false
  }
}

fetchServiceData()
</script>

<style lang="scss" scoped>
.service-versions {
  background-color: #ffffff;
  min-height: 100vh;
}


.versions-content {
  margin: 0 auto;
  max-width: 1200px;
  padding: 32px 24px;
}

.versions-header {
  margin-bottom: 24px;
}

.versions-title {
  color: #111827;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

.loading-state,
.error-state,
.empty-state {
  color: #666;
  padding: 60px 20px;
  text-align: center;
}

.spinner {
  animation: spin 1s linear infinite;
  border: 4px solid #f0f0f0;
  border-radius: 50%;
  border-top-color: #0066cc;
  height: 40px;
  margin: 0 auto 16px;
  width: 40px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.versions-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}


// Mobile responsive
@media (max-width: 767px) {
  .catalog-header {
    padding: 12px 16px;
  }

  .header-right {
    font-size: 12px;
    gap: 8px;
  }

  .logo-konnect {
    display: none;
  }

  .btn-text {
    display: none;
  }

  .btn-organization,
  .btn-settings {
    min-width: auto;
    padding: 6px 8px;
  }

  .user-name {
    display: none;
  }

  .versions-content {
    padding: 20px 16px;
  }

  .versions-title {
    font-size: 20px;
  }
}
</style>
