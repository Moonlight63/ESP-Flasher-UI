import { useMainStore } from './stores/main';
import devtools from '@vue/devtools'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
// import { useIpcRenderer } from '@vueuse/electron'
// import { ipcRenderer } from 'electron';

import './style.css'
import { createSharedStore } from './sharedState';

const app = createApp(App);
const pinia = createPinia();

app.use(router).use(pinia);

const mainStore = useMainStore()


app.mount('#app');

const sharedStore = createSharedStore(mainStore)

// sharedStore.subscribe((state) => {
//   console.log(state);
// });


// router.afterEach((to, from, failure) => {
//     if (!failure) {
//         console.log("🚀 ~ file: main.ts ~ line 17 ~ router.afterEach ~ to", to)
//         if(to.name === "scanforport") {
//             window.electron.ipcRenderer.send('scan-for-port', null);
//         }
//     }
// })

// if (process.env.NODE_ENV === 'development') {
//     devtools.connect()
// }
  
