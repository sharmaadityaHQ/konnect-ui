import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useSearch() {
  const route = useRoute()
  const router = useRouter()
  const searchQuery = ref<string>((route.query.q as string) || '')

  // watch search query and update URL (no debounce - useServices handles that)
  watch(searchQuery, (newQuery) => {
    const query = { ...route.query }

    if (newQuery.trim()) {
      query.q = newQuery
    } else {
      delete query.q
    }

    // Reset to page 1 when searching (for desktop)
    if (query.page) {
      query.page = '1'
    }

    router.replace({ query })
  })

  const clearSearch = () => {
    searchQuery.value = ''
  }

  return {
    searchQuery,
    clearSearch,
  }
}
