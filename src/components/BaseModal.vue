<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal-overlay"
        @click.self="handleClose"
      >
        <div
          :aria-labelledby="title ? 'modal-title' : undefined"
          aria-modal="true"
          class="modal-container"
          role="dialog"
        >
          <!-- Header Slot -->
          <div
            v-if="$slots.header || title"
            class="modal-header"
          >
            <slot name="header">
              <h2
                v-if="title"
                id="modal-title"
                class="modal-title"
              >
                {{ title }}
              </h2>
            </slot>
          </div>

          <!-- Content Slot -->
          <div class="modal-content">
            <slot />
          </div>

          <!-- Footer Slot -->
          <div
            v-if="$slots.footer"
            class="modal-footer"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    handleClose()
  }
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
.modal-overlay {
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  overflow-y: auto;
  padding: 16px;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
}

.modal-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  clip-path: inset(0 round 8px);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  max-width: 500px;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.modal-header {
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
  padding: 24px 24px 16px 24px;
}

.modal-title {
  color: #111827;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}

.modal-content {
  flex: 1;
  overflow-x: visible;
  overflow-y: auto;
  padding: 24px;
  position: relative;
}

.modal-footer {
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
  padding: 16px 24px;
}

// Transition animations
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  opacity: 0;
  transform: scale(0.95);
}

// Mobile responsive
@media (max-width: 767px) {
  .modal-overlay {
    align-items: center;
    padding: 16px;
  }

  .modal-container {
    border-radius: 8px;
    max-height: 90vh;
    max-width: 100%;
  }

  .modal-header {
    border-radius: 8px 8px 0 0;
    padding: 20px 16px 12px 16px;
  }

  .modal-title {
    font-size: 18px;
  }

  .modal-content {
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
    padding: 20px 16px;
    position: relative;
  }

  .modal-footer {
    border-radius: 0 0 8px 8px;
    padding: 12px 16px;
  }
}
</style>
