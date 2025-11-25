<template>
  <div id="app">
    <router-view />
    <ToastContainer />
  </div>
</template>

<script setup>
import ToastContainer from '@/components/ToastContainer.vue';
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
