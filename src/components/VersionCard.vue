<template>
  <div class="version-card">
    <div class="version-left">
      <h3 class="version-name">
        v{{ version.name }}
      </h3>
      <p class="version-description">
        {{ version.description }}
      </p>
      <div class="protocol-badges">
        <span class="protocol-badge">{{ serviceType }}</span>
      </div>
    </div>
    <div
      v-if="version.developer"
      class="version-right"
    >
      <img
        :alt="version.developer.name"
        class="developer-avatar"
        :src="version.developer.avatar"
      >
      <div class="developer-info">
        <span class="developer-name">{{ version.developer.name }}</span>
        <span class="version-date">{{ formatRelativeTime(version.updated_at) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Version } from '@/types/service'
import { formatRelativeTime } from '@/utils/dateFormat'

interface Props {
  version: Version & { serviceType: string }
}

const props = defineProps<Props>()

// Extract serviceType from the enriched version object
const serviceType = props.version.serviceType
</script>

<style lang="scss" scoped>
.version-card {
  align-items: flex-start;
  background: #ffffff;
  border: none;
  border-bottom: 1px solid #f1f1f5;
  border-radius: 0;
  display: flex;
  gap: 32px;
  justify-content: space-between;
  padding: 24px;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    box-shadow: none;
  }
}

.version-left {
  align-items: start;
  display: grid;
  flex: 1;
  gap: 40px 30px;
  grid-template-columns: 100px 400px 100px;
}

.version-name {
  color: #111827;
  font-size: 20px;
  font-weight: 600;
  grid-column: 1;
  line-height: 1.3;
  margin: 0;
  min-width: 100px;
  width: 100px;
}

.version-description {
  color: #6b7280;
  font-size: 14px;
  grid-column: 2;
  line-height: 1.6;
  margin: 0;
  max-width: 400px;
  width: 400px;
}

.protocol-badges {
  align-items: start;
  display: flex;
  gap: 8px;
  grid-column: 3;
  margin: 0;
  min-width: 100px;
  width: 100px;
}

.protocol-badge {
  background-color: #eff6ff;
  border-radius: 4px;
  color: #3b82f6;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 6px 12px;
  text-transform: uppercase;
  white-space: nowrap;
}

.version-right {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: 12px;
  min-width: 200px;
  width: 200px;
}

.developer-avatar {
  border-radius: 50%;
  flex-shrink: 0;
  height: 40px;
  object-fit: cover;
  width: 40px;
}

.developer-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}

.developer-name {
  color: #111827;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.version-date {
  color: #6b7280;
  font-size: 13px;
  white-space: nowrap;
}

// Mobile responsive
@media (max-width: 970px) {
  .version-card {
    flex-direction: column;
    gap: 16px;
    padding: 16px 20px;
  }

  .version-left {
    display: flex;
    flex-direction: column;
    gap: 12px;
    grid-template-columns: none;
  }

  .version-name {
    grid-column: auto;
    min-width: auto;
    width: auto;
  }

  .version-description {
    grid-column: auto;
    margin: 0;
    max-width: none;
    width: auto;
  }

  .protocol-badges {
    grid-column: auto;
    margin: 0;
    min-width: auto;
    width: auto;
  }

  .version-right {
    min-width: auto;
    width: 100%;
  }
}
</style>
