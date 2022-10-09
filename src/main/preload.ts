import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => {
      // let validChannels = ['nameOfClientChannel'] // <-- Array of all ipcRenderer Channels used in the client
      // if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data)
      // }
    },
    on: (channel, func) => {
      // let validChannels = ['nameOfElectronChannel'] // <-- Array of all ipcMain Channels used in the electron
      // if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args))
      // }
    },
    invoke: (channel: string, data: any) => {
      return ipcRenderer.invoke(channel, data);
    },
  },
})

// window.addEventListener('DOMContentLoaded', () => {
//   for (const versionType of['chrome', 'electron', 'node']) {
//       document.getElementById(`${versionType}-version`).innerText = process.versions[versionType]
//   }

//   document.getElementById('serialport-version').innerText = require('serialport/package').version

// })

// // Expose ipcRenderer to the client
// contextBridge.exposeInMainWorld('ipcRenderer', {
//   send: (channel, data) => {
//     // let validChannels = ['nameOfClientChannel'] // <-- Array of all ipcRenderer Channels used in the client
//     // if (validChannels.includes(channel)) {
//       ipcRenderer.send(channel, data)
//     // }
//   },
//   on: (channel, func) => {
//     // let validChannels = ['nameOfElectronChannel'] // <-- Array of all ipcMain Channels used in the electron
//     // if (validChannels.includes(channel)) {
//       // Deliberately strip event as it includes `sender`
//       ipcRenderer.on(channel, (event, ...args) => func(...args))
//     // }
//   }
// })