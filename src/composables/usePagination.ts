import { ref, computed, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Service } from '@/types/service'

export function usePagination(services: Ref<Service[]>, pageSize = 9) {
  const route = useRoute()
  const router = useRouter()

  // Initialize current page from URL
  const currentPage = ref(parseInt(route.query.page as string) || 1)

  // Watch route changes to update current page
  watch(() => route.query.page, (newPage) => {
    currentPage.value = parseInt(newPage as string) || 1
  })

  // Computed properties
  const totalPages = computed(() =>
    Math.ceil(services.value.length / pageSize),
  )

  const startIndex = computed(() =>
    (currentPage.value - 1) * pageSize,
  )

  const endIndex = computed(() =>
    Math.min(startIndex.value + pageSize, services.value.length),
  )

  const paginatedItems = computed(() =>
    services.value.slice(startIndex.value, endIndex.value),
  )

  const hasNextPage = computed(() =>
    currentPage.value < totalPages.value,
  )

  const hasPrevPage = computed(() =>
    currentPage.value > 1,
  )

  // Methods
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages.value) return

    const query = { ...route.query, page: page.toString() }
    router.push({ query })
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      goToPage(currentPage.value + 1)
    }
  }

  const prevPage = () => {
    if (hasPrevPage.value) {
      goToPage(currentPage.value - 1)
    }
  }

  // Ensure current page is valid when items change
  watch([services, () => services.value.length], () => {
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      goToPage(1)
    }
  })

  return {
    currentPage,
    totalPages,
    pageSize,
    startIndex,
    endIndex,
    paginatedItems,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
  }
}
