import { ref, computed, watch, onMounted, onUnmounted, type Ref } from 'vue'
import type { Service } from '@/types/service'

export function useInfiniteScroll(services: Ref<Service[]>, pageSize = 9) {
  const loadedPages = ref(1)
  const sentinelRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  // Compute visible items based on loaded pages
  const visibleItems = computed(() =>
    services.value.slice(0, loadedPages.value * pageSize),
  )

  const hasMore = computed(() =>
    visibleItems.value.length < services.value.length,
  )

  const totalItems = computed(() => services.value.length)

  // Load next page
  const loadNextPage = () => {
    if (hasMore.value) {
      loadedPages.value++
    }
  }

  // Setup IntersectionObserver
  const setupObserver = () => {
    if (!sentinelRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore.value) {
          loadNextPage()
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before sentinel is visible
        threshold: 0.1,
      },
    )

    observer.observe(sentinelRef.value)
  }

  // Cleanup observer
  const cleanupObserver = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  // Reset to page 1 when services change (e.g., search)
  watch(services, () => {
    loadedPages.value = 1
  })

  // Watch for sentinel ref and setup observer
  watch(sentinelRef, (newVal) => {
    cleanupObserver()
    if (newVal) {
      setupObserver()
    }
  })

  onUnmounted(() => {
    cleanupObserver()
  })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Show back to top button after scrolling down
  const showBackToTop = ref(false)

  const handleScroll = () => {
    showBackToTop.value = window.scrollY > 800
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    visibleItems,
    hasMore,
    totalItems,
    sentinelRef,
    loadedPages,
    scrollToTop,
    showBackToTop,
  }
}
