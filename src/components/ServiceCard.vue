<template>
  <div
    class="service-card"
    @click="handleCardClick"
  >
    <div class="card-header">
      <div
        class="status-badge"
      >
        <span>
          <template v-if="service.status === 'published'">
            <img
              alt="Published"
              height="20"
              src="/images/published_icon.svg"
            >
          </template>
          <template v-else-if="service.status === 'in_progress'">
            <img
              alt="In Progress"
              height="20"
              src="/images/progress_icon.svg"
            >
          </template>
          <template v-else>
            <img
              alt="Unpublished"
              height="20"
              src="/images/unpublished_icon.svg"
            >
          </template>
        </span>
        <span class="status-text">{{ statusText }}</span>
      </div>

      <div class="version-badge">
        {{ service.versions }} {{ service.versions === 1 ? 'version' : 'versions' }}
      </div>
    </div>

    <h3 class="service-name">
      {{ service.name }}
    </h3>

    <p class="service-description">
      {{ service.description }}
    </p>

    <div class="card-footer">
      <div class="service-metrics">
        <div class="metric">
          <span class="metric-bullet" />
          <span class="metric-label">{{ service.metrics.latency }} <span class="metric-label-suffix">latency</span></span>
        </div>
        <div class="metric">
          <span class="metric-bullet" />
          <span class="metric-label">{{ service.metrics.uptime }} <span class="metric-label-suffix">uptime</span></span>
        </div>
        <div class="metric-row">
          <div class="metric">
            <span class="metric-bullet" />
            <span class="metric-label">{{ service.metrics.requests }} <span class="metric-label-suffix">requests</span></span>
          </div>
          <div class="metric metric-separator">
            <span class="metric-bullet" />
            <span class="metric-label">{{ service.metrics.errors }} <span class="metric-label-suffix">errors</span></span>
          </div>
        </div>
      </div>

      <div
        v-if="service.contributors.length > 0"
        class="contributors"
      >
        <div class="avatar-group">
          <img
            v-for="contributor in visibleContributors"
            :key="contributor.id"
            :alt="contributor.name"
            class="avatar"
            :src="contributor.avatar"
            :title="contributor.name"
          >
          <div
            v-if="remainingCount > 0"
            class="avatar avatar-count"
          >
            +{{ remainingCount }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Service } from '@/types/service'

interface Props {
  service: Service
}

const props = defineProps<Props>()
const router = useRouter()

const handleCardClick = () => {
  const serializableData = props.service._raw ? JSON.parse(JSON.stringify(props.service._raw)) : null

  router.push({
    name: 'service-versions',
    params: { id: props.service.id },
    state: { apiService: serializableData },
  })
}

const statusText = computed(() => {
  switch (props.service.status) {
    case 'published':
      return 'Published to portal'
    case 'in_progress':
      return 'In progress'
    case 'unpublished':
      return 'Unpublished'
    default:
      return props.service.status
  }
})

// Show max 2 contributors, then +X for remaining
const maxVisibleContributors = 2
const visibleContributors = computed(() =>
  props.service.contributors.slice(0, maxVisibleContributors),
)
const remainingCount = computed(() =>
  Math.max(0, props.service.contributors.length - maxVisibleContributors),
)
</script>

<style lang="scss" scoped>
.service-card {
  background: #fff;
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  padding: 20px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
}

.card-header {
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: space-between;
}

.status-badge {
  align-items: center;
  border-radius: 4px;
  display: inline-flex;
  font-size: 12px;
  font-weight: 500;
  gap: 6px;

  & .status-text {
    color: #3C4557;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 16px;
    margin-top: -5px;
    opacity: 0.7;
  }
}


.version-badge {
  background-color: #eff6ff;
  border-radius: 16px;
  color: #3b82f6;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  white-space: nowrap;
}

.service-name {
  color: #111827;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0px;
  line-height: 24px;
  margin: 0;
}

.service-description {
  -webkit-box-orient: vertical;
  color: #707888;
  display: -webkit-box;
  flex-grow: 1;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0px;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  line-height: 20px;
  margin: 0;
  overflow: hidden;
}

.card-footer {
  align-items: flex-end;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-top: auto;
}

.service-metrics {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
}

.metric-row {
  display: flex;
  gap: 12px;
}

.metric {
  align-items: center;
  color: #374151;
  display: flex;
  font-size: 12px;
  font-weight: 600;
  gap: 6px;
  line-height: 1.4;

  &.metric-separator {
    padding-left: 0;

    .metric-bullet {
      background-color: #707888;
    }
  }
}

.metric-bullet {
  background-color: #10b981;
  border-radius: 50%;
  flex-shrink: 0;
  height: 6px;
  width: 6px;
}

.metric-label {
  white-space: nowrap;
}

.metric-label-suffix {
  color: #707888;
}

.contributors {
  align-items: center;
  display: flex;
  flex-shrink: 0;
}

.avatar-group {
  align-items: center;
  display: flex;
  flex-direction: row-reverse;
}

.avatar {
  border: 2px solid #fff;
  border-radius: 50%;
  height: 28px;
  margin-left: -8px;
  object-fit: cover;
  width: 28px;

  &:last-child {
    margin-left: 0;
  }

  &.avatar-count {
    align-items: center;
    background-color: #e5e7eb;
    color: #6b7280;
    display: flex;
    font-size: 10px;
    font-weight: 600;
    justify-content: center;
  }
}

// Mobile responsive
@media (max-width: 767px) {
  .card-footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .service-metrics {
    width: 100%;
  }

  .contributors {
    width: 100%;
  }
}
</style>
