<script setup lang="ts">
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

// import 'xterm/lib/addons/fullscreen/fullscreen.css'
// import 'xterm/dist/xterm.css'

const loading = ref(false)
const lastClicked = ref('')

const terminal = ref(null)

window.electron.ipcRenderer.on('read', (ev, data) => {
    console.log('got response!!', data)
    loading.value = false
})

onMounted(() => {

    const interval = setInterval(() => {
        if (terminal.value) {
            const xterm = new Terminal();
            const fitAddon = new FitAddon();
            xterm.loadAddon(fitAddon);
            xterm.open(terminal.value);
            fitAddon.fit();
            clearInterval(interval)
        }
    }, 50)
    
})



</script>

<template>
        <div class="relative flex flex-col w-full h-full min-h-full overflow-hidden overflow-y-auto gap-4 p-4">
            <div ref="terminal" />
        </div>
</template>
    
        