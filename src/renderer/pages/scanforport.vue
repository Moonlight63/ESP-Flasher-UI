<script setup lang="ts">
// import Hello from './components/Hello.vue'
import { Icon } from '@iconify/vue';

// window.electron.ipcRenderer.send('message', 'Hello from App.vue!');
</script>

<template>
  <!-- <div class="container mx-auto">
      <router-link to="/" class="btn btn-primary">Button</router-link>
  </div>

  <div class="flex items-center justify-center h-screen">
      <RouterView />
  </div> -->

  <div class="flex justify-center">
    <div class="relative w-full h-screen overflow-hidden pt-16">
      <div class="absolute top-0 left-0 w-full h-full pt-16 transition-position">
        <NavBar back="waiting" />
        <div class="relative w-full h-full min-h-full overflow-hidden grid grid-flow-row gap-4 p-4 justify-center items-center">
          
          <Icon class="spin align-middle justify-center" icon="simple-icons:spinrilla" width="6rem" />

        </div>

      </div>
    </div>
  </div>
</template>

<style>

.spin {
  animation: spin 1.2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
