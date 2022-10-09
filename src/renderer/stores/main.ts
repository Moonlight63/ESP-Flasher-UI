import { defineStore, acceptHMRUpdate } from 'pinia'
import State from '../../main/state'

// useMainStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useMainStore = defineStore('main', {
  state: () => ({
    ...State
  }),
  getters: {
    doubleCount: state => state.count * 2,
    portReady: state => state.portDetected
  },
  actions: {
    increment() {
      this.count++
    },
    setAppReady() {
      // this.appReady = true;
      console.log("🚀 ~ file: main.ts ~ line 20 ~ setAppReady ~ this.appReady", this.appReady)
      
      // this.nextEvent = "GetCurrentState"
    }
  },
})

// export const useMainStore = defineStore('main', () => {
//   const count = ref(0)
//   const name = ref('Eduardo')
//   const loading = ref(false)
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }

//   return { count, name, doubleCount, increment }
// })


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}