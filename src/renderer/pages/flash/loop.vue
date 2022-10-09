<script setup lang="ts">
// import Hello from './components/Hello.vue'
import { Icon } from '@iconify/vue';
import { useMainStore } from '../../stores/main';

const mainStore = useMainStore()

const msg = computed(() => {
  if(mainStore.flashDone) return "Done!"
  if(mainStore.flashing) return mainStore.flashProgress == "" ? "Flashing..." : mainStore.flashProgress
  if(mainStore.flashLoop) return "Waiting for Device..."
  return "Start Flashing"
})

const btnClass = computed(() => {
  if(mainStore.flashDone) return "btn-success"
  if(mainStore.flashing) return "btn-disabled bg-warning text-warning-content"
  if(mainStore.flashLoop) return "btn-info"
  return ""
})

const onClick = () => {
  // window.electron.ipcRenderer.invoke('flashloop', !looping.value).then((msg) => {
  //   console.log('got response!!', msg)
  //   looping.value = !looping.value
  // });

    // mainStore.increment()
    if(!mainStore.flashing) {
      if(mainStore.flashDone && mainStore.flashLoop) {
        mainStore.flashDone = false
      }
      mainStore.flashLoop = !mainStore.flashLoop
    }
}

// window.electron.ipcRenderer.send('message', 'Hello from App.vue!');
</script>

<template>
  <div class="grid grid-flow-row gap-4 p-4">
    <button @click="onClick()" class="card btn h-auto text-4xl" :class="btnClass">
      <Icon v-if="mainStore.flashDone" class="align-middle justify-center" icon="material-symbols:check-circle-outline" width="6rem" />
      <Icon v-else-if="mainStore.flashLoop" class="spin align-middle justify-center" icon="simple-icons:spinrilla" width="6rem" />
      <Icon v-else icon="mdi:usb-port" width="6rem"/>
      {{ msg }}
      <!-- Flash -->
    </button>
  </div>
</template>
