<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="visible"
        class="toast-container"
        :class="`toast-${type}`"
      >
        <div class="toast-content">
          <span class="toast-message">{{ message }}</span>
          <button
            aria-label="Close toast"
            class="toast-close"
            @click="handleClose"
          >
            ×
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'success',
  duration: 3000,
  modelValue: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const visible = ref(props.modelValue)
let timeoutId: ReturnType<typeof setTimeout> | null = null

const handleClose = () => {
  visible.value = false
  emit('update:modelValue', false)
  emit('close')
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

const startAutoDismiss = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  timeoutId = setTimeout(() => {
    handleClose()
  }, props.duration)
}

watch(() => props.modelValue, (newValue) => {
  visible.value = newValue
  if (newValue) {
    startAutoDismiss()
  } else if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
})

onMounted(() => {
  if (visible.value) {
    startAutoDismiss()
  }
})
</script>

<style lang="scss" scoped>
.toast-container {
  animation: slideIn 0.3s ease-out;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  min-width: 300px;
  position: fixed;
  right: 24px;
  top: 24px;
  z-index: 2000;
}

.toast-content {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 16px 20px;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
}

.toast-close {
  align-items: center;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  font-size: 24px;
  height: 20px;
  justify-content: center;
  line-height: 1;
  opacity: 0.8;
  padding: 0;
  transition: opacity 0.2s;
  width: 20px;

  &:hover {
    opacity: 1;
  }
}

.toast-success {
  background-color: #07a88d;
  color: #fff;
}

.toast-error {
  background-color: #ef4444;
  color: #fff;
}

.toast-info {
  background-color: #1456cb;
  color: #fff;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// Toast transition
.toast-enter-active {
  animation: slideIn 0.3s ease-out;
}

.toast-leave-active {
  animation: slideOut 0.3s ease-in;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

// Mobile responsive
@media (max-width: 767px) {
  .toast-container {
    left: 16px;
    max-width: none;
    min-width: auto;
    right: 16px;
    top: 16px;
  }

  .toast-content {
    padding: 14px 16px;
  }

  .toast-message {
    font-size: 13px;
  }
}
</style>
