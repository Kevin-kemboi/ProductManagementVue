<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2 w-80">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'p-4 rounded-lg shadow-lg flex items-start justify-between',
            toastClasses[toast.type]
          ]"
          role="alert"
        >
          <div class="flex items-start flex-1">
            <span :class="['mr-3 text-xl', iconClasses[toast.type]]">
              {{ icons[toast.type] }}
            </span>
            <p class="text-sm font-medium">{{ toast.message }}</p>
          </div>
          <button
            @click="removeToast(toast.id)"
            class="ml-3 text-white hover:text-gray-200 focus:outline-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast';

const { toasts, removeToast } = useToast();

const toastClasses = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-white',
  info: 'bg-blue-500 text-white',
};

const icons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const iconClasses = {
  success: 'text-white',
  error: 'text-white',
  warning: 'text-white',
  info: 'text-white',
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
