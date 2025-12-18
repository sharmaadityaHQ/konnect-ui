<template>
  <div class="service-catalog">
    <CatalogHeader />

    <div class="catalog-content">
      <div class="content-header">
        <div class="content-header-left">
          <h2 class="content-title">
            Service Hub
          </h2>
          <p class="content-description">
            Organize services, manage and track versioning and API service documentation.
            <a
              class="learn-more"
              href="https://konghq.com/products/kong-konnect/features/api-service-catalog"
              target="_blank"
            >Learn more</a>
          </p>
        </div>
        <div class="content-header-right">
          <div class="search-wrapper">
            <input
              v-model="searchQuery"
              class="search-input"
              data-testid="search-input"
              placeholder="Search"
              type="search"
            >
          </div>
          <button
            class="btn-primary"
            @click="showModal = true"
          >
            <span class="icon-plus">+</span>
            Service Package
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="services.length === 0"
        class="empty-state"
        data-testid="no-results"
      >
        <p v-if="searchQuery">
          No services found matching "{{ searchQuery }}"
        </p>
        <p v-else>
          No services available
        </p>
      </div>

      <!-- Loading State -->
      <div
        v-else-if="loading"
        class="loading-state"
      >
        <div class="spinner" />
        <p>
          Loading services...
        </p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="error-state"
      >
        <p>
          Failed to load services. Please try again.
        </p>
      </div>

      <!-- Services Grid -->
      <template v-else>
        <!-- Desktop: Paginated Grid -->
        <div
          v-if="!isMobile"
          class="services-grid"
        >
          <ServiceCard
            v-for="service in paginatedItems"
            :key="service.id"
            :service="service"
          />
        </div>

        <!-- Mobile: Infinite Scroll Grid -->
        <div
          v-else
          class="services-grid"
        >
          <ServiceCard
            v-for="service in visibleItems"
            :key="service.id"
            :service="service"
          />

          <!-- Sentinel element for intersection observer -->
          <div
            ref="sentinelRef"
            class="scroll-sentinel"
          >
            <div
              v-if="hasMore"
              class="load-trigger"
            >
              <!-- Invisible trigger element -->
            </div>
            <div
              v-else
              class="end-message"
            >
              You've viewed all {{ totalItems }} services
            </div>
          </div>
        </div>

        <!-- Desktop Pagination Controls -->
        <div
          v-if="!isMobile && totalPages > 1"
          class="pagination-wrapper"
        >
          <button
            aria-label="Previous page"
            class="pagination-arrow"
            :disabled="!hasPrevPage"
            @click="prevPage"
          >
            ←
          </button>
          <div class="pagination-info">
            <b>{{ startIndex + 1 }} to {{ endIndex }}</b> of {{ services.length }} services
          </div>
          <button
            aria-label="Next page"
            class="pagination-arrow"
            :disabled="!hasNextPage"
            @click="nextPage"
          >
            →
          </button>
        </div>

        <!-- Mobile: Results Info -->
        <div
          v-if="isMobile && !hasMore"
          class="mobile-results-info"
        >
          Showing all {{ totalItems }} services
        </div>
      </template>

      <!-- Back to Top Button (Mobile) -->
      <Transition name="fade">
        <button
          v-if="isMobile && showBackToTop"
          aria-label="Back to top"
          class="back-to-top"
          @click="scrollToTop"
        >
          ↑
        </button>
      </Transition>
    </div>

    <!-- Create Service Package Modal -->
    <CreateServicePackageModal
      v-model="showModal"
      @create="handleCreate"
    />

    <!-- Toast Notification -->
    <BaseToast
      v-model="showToast"
      :message="toastMessage"
      type="success"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onActivated } from 'vue'
import useServices from '@/composables/useServices'
import { useSearch } from '@/composables/useSearch'
import { usePagination } from '@/composables/usePagination'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import { useBreakpoint } from '@/composables/useBreakpoint'
import ServiceCard from '@/components/ServiceCard.vue'
import CreateServicePackageModal from '@/components/CreateServicePackageModal.vue'
import BaseToast from '@/components/BaseToast.vue'
import CatalogHeader from '@/components/CatalogHeader.vue'

defineOptions({
  name: 'ServiceCatalog',
})

const { isMobile } = useBreakpoint()

const { searchQuery } = useSearch()

const { services, loading, error, refetch } = useServices(searchQuery)

const isFirstActivation = ref(true)

// Refetch data when component becomes active again (navigating back from versions page)
onActivated(() => {
  if (isFirstActivation.value) {
    isFirstActivation.value = false
    return
  }
  refetch()
})

// Desktop pagination
const {
  totalPages,
  startIndex,
  endIndex,
  paginatedItems,
  hasNextPage,
  hasPrevPage,
  nextPage,
  prevPage,
} = usePagination(services, 9)

// Mobile infinite scroll
const {
  visibleItems,
  hasMore,
  totalItems,
  sentinelRef,
  scrollToTop,
  showBackToTop,
} = useInfiniteScroll(services, 9)

const showModal = ref(false)

const showToast = ref(false)
const toastMessage = ref('')

type CreateFormData = {
  name: string
  description: string
}

const handleCreate = (formData: CreateFormData) => {
  toastMessage.value = `Service package "${formData.name}" created successfully!`
  showToast.value = true
  showModal.value = false
}
</script>

<style lang="scss" scoped>
.service-catalog {
  background-color: #f5f5f5;
  min-height: 100vh;
}


.catalog-content {
  margin: 0 auto;
  padding: 32px 24px 100px 24px;
}

.content-header {
  align-items: flex-start;
  display: flex;
  gap: 32px;
  justify-content: space-between;
  margin-bottom: 32px;
}

.content-header-left {
  flex: 1;
}

.content-title {
  color: #111827;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 8px 0;
}

.content-description {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.learn-more {
  color: #1456cb;
  margin-left: 4px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.content-header-right {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: 12px;
}

.search-wrapper {
  position: relative;
}

.search-input {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M14 14L10.65 10.65' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-position: 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  padding: 10px 16px 10px 40px;
  transition: border-color 0.2s;
  width: 210px;

  &:focus {
    border-color: #1456cb;
    box-shadow: 0 0 0 3px rgba(20, 86, 203, 0.1);
    outline: none;
  }

  &::placeholder {
    color: #9ca3af;
  }
}

.btn-primary {
  align-items: center;
  background-color: #07a88d;
  border: none;
  border-radius: 100px;
  color: #fff;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 600;
  gap: 6px;
  padding: 10px 20px;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: #068f7a;
  }
}

.icon-plus {
  font-size: 18px;
  line-height: 1;
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

.services-grid {
  display: grid;
  gap: 40px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  margin-bottom: 40px;

  @media (min-width: 768px) and (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.scroll-sentinel {
  grid-column: 1 / -1;
  padding: 20px;
  text-align: center;
}

.end-message {
  color: #999;
  font-size: 14px;
  padding: 20px;
}

.pagination-wrapper {
  align-items: center;
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.95);
  bottom: 0;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 16px;
  justify-content: center;
  left: 0;
  padding: 16px 24px;
  position: fixed;
  right: 0;
  z-index: 40;
}

.pagination-arrow {
  align-items: center;
  background-color: #fff;
  border: 1px solid #a6c6ff;
  border-radius: 50%;
  color: #1456cb;
  cursor: pointer;
  display: flex;
  font-size: 18px;
  height: 40px;
  justify-content: center;
  transition: all 0.2s;
  width: 40px;

  &:hover:not(:disabled) {
    background-color: #f9fafb;
  }

  &:disabled {
    border-color: #0000001a;
    color: #00000040;
    cursor: not-allowed;
  }
}

.pagination-info {
  color: #6b7280;
  font-size: 14px;
  font-weight: 400;
  min-width: 180px;
  text-align: center;
}

.mobile-results-info {
  color: #666;
  font-size: 14px;
  margin-top: 20px;
  padding-bottom: 80px;
  text-align: center;
}

.back-to-top {
  align-items: center;
  background-color: #fff;
  border: 1px solid #a6c6ff;
  border-radius: 50%;
  bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #1456cb;
  cursor: pointer;
  display: flex;
  font-size: 18px;
  height: 40px;
  justify-content: center;
  position: fixed;
  right: 24px;
  transition: all 0.2s;
  width: 40px;
  z-index: 100;

  &:hover {
    background-color: #f9fafb;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// Mobile responsive
@media (max-width: 767px) {
  .catalog-content {
    padding: 20px 16px;
  }

  .content-header {
    flex-direction: column;
    gap: 16px;
  }

  .content-title {
    font-size: 20px;
  }

  .content-description {
    width: 100%;
  }

  .content-header-right {
    align-items: flex-end;
    flex-direction: column-reverse;
    gap: 12px;
    width: 100%;
  }

  .search-wrapper {
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .btn-primary {
    font-size: 13px;
    padding: 8px 16px;
  }

  .services-grid {
    gap: 16px;
    grid-template-columns: 1fr;
  }

  .pagination-wrapper {
    align-items: center;
    flex-direction: column;
    gap: 16px;
  }
}
</style>