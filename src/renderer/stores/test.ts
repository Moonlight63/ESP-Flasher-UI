import { defineStore, acceptHMRUpdate } from 'pinia'

// useMainStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
// export const useMainStore = defineStore('main', {
//   state: () => ({
//     msg: 'Hello World!',
//   }),
//   getters: {
//     message: state => state.msg,
//   },
//   actions: {},
// })

export const useTestStore = defineStore('main', () => {
  const SomeOther = ref(0)
  const This = ref('Eduardo')

  return { SomeOther, This }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTestStore, import.meta.hot))
}