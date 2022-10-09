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

  <!-- <div class="flex justify-center">
    <div class="relative w-full h-screen overflow-hidden pt-16">
      <div class="absolute top-0 left-0 w-full h-full pt-16 transition-position">
        <NavBar /> -->
        <div class="grid grid-flow-row gap-4 p-4">
          
          <router-link  to="flash" class="card bg-neutral text-neutral-content btn h-auto text-4xl">
            <!-- <div class="card-body items-center text-center">
              <h2 class="card-title">Cookies!</h2>
              <p>We are using cookies for no reason.</p>
              <div class="card-actions justify-end">
                <button class="btn btn-primary">Accept</button>
                <button class="btn btn-ghost">Deny</button>
              </div>
            </div> -->
            <Icon icon="mdi:usb-port" width="6rem"/>
            Flash
          </router-link>

          <router-link  to="read" class="card bg-neutral-focus text-neutral-content btn h-auto text-2xl btn-disabled">
            <!-- <div class="card-body items-center text-center">
              <h2 class="card-title">Cookies!</h2>
              <p>We are using cookies for no reason.</p>
              <div class="card-actions justify-end">
                <button class="btn btn-primary">Accept</button>
                <button class="btn btn-ghost">Deny</button>
              </div>
            </div> -->
            <Icon icon="mdi:clipboard-arrow-down-outline" width="6rem"/>
            Read
            (Comming Soon)
          </router-link>

        </div>

      <!-- </div>
    </div>
  </div> -->
</template>
