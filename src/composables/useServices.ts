import { ref, watch, type Ref } from 'vue'
import axios from 'axios'
import type { Service, ApiService } from '@/types/service'
import { transformService } from '@/utils/transformService'

// This composable is a simplified example for the exercise **and could likely be improved**.
// Feel free to leave as-is, modify, or remove this file (and any others) as desired.
// https://vuejs.org/guide/reusability/composables.html

// NOTE: Now supports server-side search via query parameter.
// If service count exceeds 100, consider:
// - Server-side pagination API endpoint
// - Virtual scrolling for performance

interface UseServicesReturn {
  services: Ref<Service[]>
  loading: Ref<boolean>
  error: Ref<boolean>
  refetch: () => Promise<void>
}

export default function useServices(searchQuery?: Ref<string>): UseServicesReturn {
  const services = ref<Service[]>([])
  const loading = ref<boolean>(false)
  const error = ref<boolean>(false)

  // Debounce timer for search
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const getServices = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = false

      // build query params - send search query to server if provided
      const params: Record<string, string> = {}
      if (searchQuery?.value && searchQuery.value.trim()) {
        params.q = searchQuery.value.trim()
      }

      const { data } = await axios.get<ApiService[]>('/api/services', { params })

      // transform and store data (attach raw API data for navigation)
      services.value = Array.isArray(data) ? data.map(apiService => transformService(apiService, true)) : []
    } catch (err: unknown) {
      error.value = true
      console.error('Failed to fetch services:', err)
    } finally {
      loading.value = false
    }
  }

  // watch for search query changes and re-fetch with debounce
  if (searchQuery) {
    watch(searchQuery, () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      debounceTimer = setTimeout(() => {
        getServices()
      }, 300)
    })
  }

  getServices()

  return {
    services,
    loading,
    error,
    refetch: getServices,
  }
}