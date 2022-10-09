<script setup lang="ts">
import { useMainStore } from '../../stores/main';


// const boards = [
//   { id: "x110", name: "X110" },
//   // { id: "x120", name: "X120" },
//   // { id: "x130", name: "X130" },
//   // { id: "x140", name: "X140" },
//   { id: "x210", name: "X210" },
//   // { id: "x220", name: "LoRa Board" },
//   // { id: "x230", name: "Fuse Checker" },
//   // { id: "x240", name: "HVAC Controller" },
// ]

const loading = ref(false)
const lastClicked = ref('')

const router = useRouter()

const mainStore = useMainStore()

// window.electron.ipcRenderer.on('flash-complete', (ev, data) => {
//   console.log('got response!!', data)
//   loading.value = false
// })

const getClick = (id: string) => {
  // console.log(id);
  // loading.value = true
  // lastClicked.value = id

  mainStore.selectedFirmware = id
  router.push({ path: '/flash/loop' })

  // window.electron.ipcRenderer.invoke('flash', id).then((msg) => {
  //   console.log('got response!!', msg)
  //   loading.value = false
  //   router.push({ path: '/flash/loop' })
  // });
}



</script>

<template>
    <!-- <div class="flex justify-center"> -->
    <!-- <div class="relative w-full h-screen overflow-hidden shadow-xl shadow-black pt-16"> -->
        <!-- <div class="absolute top-0 left-0 w-full h-full pt-16 transition-position"> -->
        <!-- <NavBar back="waiting" /> -->
        <div class="relative flex flex-col w-full h-full min-h-full overflow-hidden overflow-y-auto gap-4 p-4">
          <!-- <router-link  to="flash/flash2" class="btn btn-primary btn-lg">
            test
          </router-link> -->
            <!-- <button v-for="file in mainStore.firmwareFiles" class="btn btn-primary btn-lg" :class="[loading ? board.id == lastClicked ? 'loading' : 'btn-disabled' : '']" @click="getClick(file)">{{ file.slice(0,-4) }}</button> -->
            <button v-for="file in mainStore.firmwareFiles" class="btn btn-primary btn-lg" @click="getClick(file)">{{ file.slice(0,-4) }}</button>
        </div>

        <!-- </div> -->
    <!-- </div> -->
    <!-- </div> -->
</template>
    
        