<script setup lang="ts">
// import Hello from './components/Hello.vue'
import { Icon } from '@iconify/vue';
import { computedEager } from '@vueuse/shared';

import {useMainStore} from './stores/main'

window.electron.ipcRenderer.send('message', 'Hello from App.vue!');

// const connected = ref(false)

const mainStore = useMainStore()

const portReady = computed(() => mainStore.portDetected)
// const portReady = true

const route = useRoute()
const showBack = computed(() => {
  let upperpath = route.path.split('/')
  if (upperpath[0] == "" && upperpath[1] == "") return ""
  upperpath.shift()
  upperpath.pop()
  return "/" + upperpath.join('/')
})

// Register Listeners
onMounted(() => {
  nextTick(() => {
    // mainStore.setAppReady()
    window.electron.ipcRenderer.send('app-ready', null);
  })
  // window.electron.ipcRenderer.invoke('check-started', null).then((started) => {
  //   window.electron.ipcRenderer.on('port-connected', (ev, data) => {
  //     console.log('Port Connected', data)
  //     connected.value = true;
  //   })
  //   window.electron.ipcRenderer.on('port-disconnected', (ev, data) => {
  //     console.log('Port Disconnected', data)
  //     connected.value = false;
  //   })

  //   window.electron.ipcRenderer.on('log-msg', (ev, data) => {
  //     console.log("🚀 ~ file: App.vue ~ line 32 ~ window.electron.ipcRenderer.on ~ data", ev)
  //     console.log('Log From Main:', data)
  //   })

  //   if(started) {
  //     window.electron.ipcRenderer.invoke('check-port', null).then((result) => {
  //       connected.value = result;
  //     });
  //   } else {
  //     window.electron.ipcRenderer.send('app-started', null);
  //     mainStore.setAppReady()
  //   }
  // })
})

</script>

<template>

<div class="flex justify-center">
    <div class="relative w-full h-screen overflow-hidden pt-16">
      <div class="absolute top-0 left-0 w-full h-full pt-16 transition-position">
        <NavBar :back="showBack" />
        <div class="relative w-full h-full min-h-full overflow-hidden grid">

          <!-- <div v-if="!portReady" class="grid justify-center items-center">
          
            <Icon class="spin align-middle justify-center" icon="simple-icons:spinrilla" width="6rem" />

          </div> -->
          
          <RouterView v-slot="{ Component, route }">
            <Transition :name="route.meta.transition || 'fade'">
              <Component :is="Component" />
            </Transition>
          </RouterView>
          <!-- <RouterView v-if="portReady" v-slot="{ Component, route }">
            <Transition :name="route.meta.transition || 'fade'">
              <Component :is="Component" />
            </Transition>
          </RouterView> -->
        </div>

      </div>
    </div>
  </div>

</template>


<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.25s ease;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .fade-enter-active {
    z-index: 50;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  .bounce-enter-active,
  .bounce-leave-active {
    transition: opacity 400ms ease;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .bounce-leave-to {
    opacity: 0;
  }
  .bounce-enter-active {
    -webkit-animation: bounce-in 750ms;
    animation: bounce-in 750ms;
    z-index: 50;
  }
  @-webkit-keyframes bounce-in {
    0% {
      -webkit-transform: translateY(-100%);
      transform: translateY(-100%);
      -webkit-animation-timing-function: ease-in;
      animation-timing-function: ease-in;
    }
    40%,
    70%,
    90%,
    100% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
      -webkit-animation-timing-function: ease-out;
      animation-timing-function: ease-out;
      opacity: 1;
    }
    55% {
      -webkit-transform: translateY(-10%);
      transform: translateY(-10%);
      -webkit-animation-timing-function: ease-in;
      animation-timing-function: ease-in;
    }
    80% {
      -webkit-transform: translateY(-5%);
      transform: translateY(-5%);
      -webkit-animation-timing-function: ease-in;
      animation-timing-function: ease-in;
    }
    95% {
      -webkit-transform: translateY(-1%);
      transform: translateY(-1%);
      -webkit-animation-timing-function: ease-in;
      animation-timing-function: ease-in;
    }
  }
  @keyframes bounce-in {
    0% {
      -webkit-transform: translateY(-100%);
      transform: translateY(-100%);
      -webkit-animation-timing-function: ease-in;
      animation-timing-function: ease-in;
    }
    40%,
    70%,
    90%,
    100% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
      -webkit-animation-timing-function: ease-out;
      animation-timing-function: ease-out;
      opacity: 1;
    }
    55% {
      -webkit-transform: translateY(-10%);
      transform: translateY(-10%);
      -webkit-animation-timing-function: ease-in;
      animation-timing-function: ease-in;
    }
    80% {
      -webkit-transform: translateY(-5%);
      transform: translateY(-5%);
      -webkit-animation-timing-function: ease-in;
      animation-timing-function: ease-in;
    }
    95% {
      -webkit-transform: translateY(-1%);
      transform: translateY(-1%);
      -webkit-animation-timing-function: ease-in;
      animation-timing-function: ease-in;
    }
  }

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