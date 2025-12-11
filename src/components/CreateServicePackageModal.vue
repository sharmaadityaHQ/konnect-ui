<template>
  <BaseModal
    :model-value="modelValue"
    title="Create Service Package"
    @close="handleClose"
    @update:model-value="handleUpdate"
  >
    <template #footer>
      <div class="modal-actions">
        <button
          class="btn-cancel"
          @click="handleCancel"
        >
          Cancel
        </button>
        <button
          class="btn-create"
          :disabled="!isFormValid"
          @click="handleCreate"
        >
          Create
        </button>
      </div>
    </template>

    <form
      class="service-package-form"
      @submit.prevent="handleCreate"
    >
      <div class="form-group">
        <label
          class="form-label"
          for="service-name"
        >
          Name <span class="required">*</span>
        </label>
        <input
          id="service-name"
          v-model="formData.name"
          class="form-input"
          placeholder="Enter service package name"
          required
          type="text"
        >
      </div>

      <div class="form-group">
        <label
          class="form-label"
          for="service-description"
        >
          Description
        </label>
        <textarea
          id="service-description"
          v-model="formData.description"
          class="form-textarea"
          placeholder="Enter service package description (optional)"
          rows="4"
        />
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from './BaseModal.vue'

interface Props {
  modelValue: boolean
}

interface FormData {
  name: string
  description: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  create: [data: FormData]
}>()

const formData = ref<FormData>({
  name: '',
  description: '',
})

const isFormValid = computed(() => {
  return formData.value.name.trim() !== ''
})

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
  }
}

const handleUpdate = (value: boolean) => {
  emit('update:modelValue', value)
  if (!value) {
    resetForm()
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
  resetForm()
}

const handleCancel = () => {
  handleClose()
}

const handleCreate = () => {
  if (!isFormValid.value) {
    return
  }

  emit('create', {
    name: formData.value.name.trim(),
    description: formData.value.description.trim(),
  })

  handleClose()
}

// Reset form when modal closes
watch(() => props.modelValue, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})
</script>

<style lang="scss" scoped>
.service-package-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  color: #374151;
  font-size: 14px;
  font-weight: 500;
}

.required {
  color: #ef4444;
}

.form-input,
.form-textarea {
  background-color: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  padding: 10px 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;

  &:focus {
    border-color: #1456cb;
    box-shadow: 0 0 0 3px rgba(20, 86, 203, 0.1);
    outline: none;
  }

  &::placeholder {
    color: #9ca3af;
  }
}

.form-textarea {
  min-height: 80px;
  resize: vertical;
}


.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-create {
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 20px;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: #fff;
  border: 1px solid #d1d5db;
  color: #374151;

  &:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }
}

.btn-create {
  background-color: #07a88d;
  color: #fff;

  &:hover:not(:disabled) {
    background-color: #068f7a;
  }

  &:disabled {
    background-color: #d1d5db;
    color: #9ca3af;
    cursor: not-allowed;
  }
}

// Mobile responsive
@media (max-width: 767px) {
  .service-package-form {
    gap: 16px;
  }

  .form-group {
    gap: 6px;
  }

  .form-label {
    font-size: 13px;
  }

  .form-input,
  .form-textarea {
    font-size: 14px;
    padding: 10px 14px;
  }

  .modal-actions {
    flex-direction: column-reverse;
    gap: 8px;
  }

  .btn-cancel,
  .btn-create {
    padding: 12px 20px;
    width: 100%;
  }
}
</style>
