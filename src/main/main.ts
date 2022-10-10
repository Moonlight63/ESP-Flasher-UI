import {app, BrowserWindow, ipcMain, session} from 'electron';
import {join} from 'path';

import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

import * as cli from './cli'

import { SerialPort } from 'serialport';
import path from 'path'
import fs from 'fs'
import { PortInfo } from '@serialport/bindings-cpp';
import process from 'process';
import { timeout } from 'rxjs';

import * as esptool from './esptool';
import { createSharedStore } from './sharedState';

import State from './state'



// let connectedPort = "";
// let portConnected = false;
// let appStarted = false;

const sharedStore = createSharedStore<Partial<typeof State>>(State);

const cwd = process.env.PORTABLE_EXECUTABLE_DIR || process.cwd();
// const temp = process.env.PORTABLE_EXECUTABLE_DIR
console.log(cwd);

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 320,
    height: 480,
    frame: false,
    kiosk: true,
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      // allowRunningInsecureContent: true,
      // webSecurity: false
    }
  });

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\'']
      }
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  installExtension(VUEJS_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('message', (event, message) => {
  console.log(message);
})

// ipcMain.on('greet', (ev, data) => {
//   console.log('greeting from renderer', data)
//   ev.sender.send('greet-response','hello')
// })

// async function listSerialPorts() {
//   await SerialPort.list().then((ports: PortInfo[]) => {
//     // if(err) {
//     //   // document.getElementById('error').textContent = err.message
//     //   return
//     // } else {
//     //   // document.getElementById('error').textContent = ''
//     // }
//     console.log('ports', ports);

//     if (ports.length === 0) {
//       // document.getElementById('error').textContent = 'No ports discovered'
//     }

//     // tableHTML = tableify(ports)
//     // document.getElementById('ports').innerHTML = tableHTML
//   })
// }

// ipcMain.on('flash-start', (ev, data) => {
//   console.log('starting flash', data)
//   const esptoolPath = path.join(__dirname, './esptool-2.8/esptool.py');
//   console.log("🚀 ~ file: main.ts ~ line 103 ~ ipcMain.on ~ esptoolPath", esptoolPath)
//   const fpath = path.join(process.cwd(), 'filename.bin');
//   console.log("🚀 ~ file: main.ts ~ line 106 ~ ipcMain.on ~ fpath", fpath)
//   listSerialPorts().then(() => {
//     console.log('ports found')
//   })
//   setTimeout(() => {
//     ev.sender.send('flash-complete')
//   }, 3000)
// })

// let flashLoop = false;
// let flashFlag = false;
// let flashId = "";
// ipcMain.handle('flash', async (ev, data) => {
//   // console.log('starting flash', data)
//   // const esptoolPath = path.join(__dirname, './esptool-2.8/esptool.py');
//   // console.log("🚀 ~ file: main.ts ~ line 103 ~ ipcMain.on ~ esptoolPath", esptoolPath)
//   // const fpath = path.join(process.cwd(), 'filename.bin');
//   // console.log("🚀 ~ file: main.ts ~ line 106 ~ ipcMain.on ~ fpath", fpath)
//   // BrowserWindow.getAllWindows()[0].webContents.send('log-msg', esptoolPath)
//   // // console.log("🚀 ~ file: main.ts ~ line 123 ~ ipcMain.handle ~ BrowserWindow.getAllWindows()", BrowserWindow.getAllWindows())
//   // BrowserWindow.getAllWindows()[0].webContents.send('log-msg', fpath)
//   // listSerialPorts().then(() => {
//   //   console.log('ports found')
//   // })
//   // await new Promise(resolve => setTimeout(resolve, 3000));

//   // if ( portConnected && connectedPort != "" ){
//   //   const file = path.join(__dirname, './firmwares/' + data + '.bin');
//   //   console.log(`** uploading ${file} on port ${connectedPort}...`);
//   //   await esptool
//   //     .upload(connectedPort, file, true)
//   //     .then(exitCode => console.log(`** finished with exit-code ${exitCode}`))
//   //     // .catch(espErrorHandler);
//   //   return "Flash Complete!"
//   // }
//   // return "Error"

//   flashId = data;
//   return;

//   // return ["Flash Complete", esptoolPath, fpath]
// })

// const startFlash = async () => {
//   if ( portConnected && connectedPort != "" && flashId != "" && !flashFlag ) {
//     const file = path.join(__dirname, './firmwares/' + flashId + '.bin');
//     console.log(`** uploading ${file} on port ${connectedPort}...`);
//     await esptool
//       .upload(connectedPort, file, true)
//       .then(exitCode => console.log(`** finished with exit-code ${exitCode}`))
//       // .catch(espErrorHandler);
//     flashFlag = true;
//     sharedStore.setState({flashDone: true})
//     return "Flash Complete!"
//   }
//   return "Error"
// }
const startFlash = async () => {
  console.log("🚀 ~ file: main.ts ~ line 176 ~ startFlash ~ cwd", cwd)
  let state = sharedStore.getState()
  if( state.connectedPort !== "" && state.portDetected && !state.flashDone ) {
    sharedStore.setState({flashing: true})
    const file = path.join(cwd, '/firmwares/' + state.selectedFirmware)
    console.log("🚀 ~ file: main.ts ~ line 180 ~ startFlash ~ file", file)
    await esptool
      .upload(state.connectedPort, file, true, (output: string) => {
        // const match = output.match("/\(([^)]+)\)/")

        let regExp = /\(([^)]+)\)/;
        let matches = regExp.exec(output);
        if(matches && matches[0])
          sharedStore.setState({ flashProgress: matches[0].slice(1,-1) })
      })
      .then(exitCode => console.log(`** finished with exit-code ${exitCode}`))

    /// TODO: error Checking
    sharedStore.setState({flashing: false, flashDone: true, flashProgress: ""})
    return "Flash Complete!"
  }

  // if ( portConnected && connectedPort != "" && flashId != "" && !flashFlag ) {
  //   const file = path.join(__dirname, './firmwares/' + flashId + '.bin');
  //   console.log(`** uploading ${file} on port ${connectedPort}...`);
  //   await esptool
  //     .upload(connectedPort, file, true)
  //     .then(exitCode => console.log(`** finished with exit-code ${exitCode}`))
  //     // .catch(espErrorHandler);
  //   flashFlag = true;
  //   sharedStore.setState({flashDone: true})
  //   return "Flash Complete!"
  // }
  return "Error"
}

// ipcMain.handle('flashloop', async (ev, data: boolean) => {
//   flashLoop = data;
//   startFlash()
//   return true
// })


// const scanPorts = (listener) => {
//   cli.getPort().then((port) => {
//     // connectedPort = port
//     // if(portConnected == false) {
//     //   portConnected = true
//     //   listener.send('port-connected', port)
//     //   ipcMain.emit('port-connected', port)
//     //   sharedStore.setState({portDetected: true})
//     //   if (flashLoop) {
//     //     startFlash()
//     //   }
//     // }

    

//     if(sharedStore.getState().portDetected == false) {
//       sharedStore.setState({portDetected: true})
//       if (sharedStore.getState().flashing) {
//         startFlash()
//       }
//     }
//   }).catch((e) => {
//     // connectedPort = ""
//     // if(portConnected == true) {
//     //   portConnected = false
//     //   listener.send('port-disconnected', null)
//     //   ipcMain.emit('port-disconnected', null)
//     //   flashFlag = false
//     //   // sharedStore.setState({flashing: false, portDetected: false})
//     // }

//     if(sharedStore.getState().portDetected == true) {
//       sharedStore.setState({portDetected: false, flashDone: false})
//     }
//   }).finally(() => {
//     setTimeout(() => scanPorts(listener), 1000)
//   })
// }

const checkPort = () => {
  cli.getPort().then((port) => {
    if(sharedStore.getState().portDetected == false) {
      sharedStore.setState({portDetected: true, connectedPort: port})
      // if (sharedStore.getState().flashLoop) {
      //   // startFlash()
      // }
    }
  }).catch((e) => {
    if(sharedStore.getState().portDetected == true) {
      sharedStore.setState({portDetected: false, flashDone: false, connectedPort: ""})
    }
  })
}

const eventLoop = () => {
  
  console.log("🚀 ~ file: main.ts ~ line 265 ~ eventLoop ~ currentState", "Loop")
  let currentState = sharedStore.getState()
  if(currentState.portDetected) {
    if(!currentState.flashing) {
      if(currentState.flashLoop && !currentState.flashDone) {
        startFlash()
      }
      checkPort()
    }
  } else {
    checkPort()
  }
  
  setTimeout(() => eventLoop(), 1000)
}


// ipcMain.on('app-started', (ev, data) => {
//   console.log("🚀 ~ file: main.ts ~ line 105 ~ ipcMain.on ~ 'scan-for-port'", 'scan-for-port')
//   scanPorts(ev.sender)
//   appStarted = true;
// })

// ipcMain.handle('check-port', async (ev, data) => {
//   return portConnected
// })

// ipcMain.handle('check-started', async (ev, data) => {
//   return appStarted
// })


// const initState = {};

// const sharedStore = createSharedStore(State);

sharedStore.subscribe((state) => {
  // console.log("🚀 ~ file: main.ts ~ line 222 ~ sharedStore.subscribe ~ state", state)
  // sharedStore.setState({ count: 5 })
});

ipcMain.handle('tryThing', async (ev, data) => {
  console.log("🚀 ~ file: main.ts ~ line 232 ~ ipcMain.handle ~ data", data)
  sharedStore.setState({testVal: 5})
})

ipcMain.on('app-ready', (ev, data) => {
  // scanPorts(ev.sender)
  fs.readdir(path.join(cwd, '/firmwares'), (err, files) => {
    files.filter(file => {
      return path.extname(file).toLowerCase() === '.bin'
    })
    sharedStore.registerListener(ev.sender.id)
    sharedStore.setState({appReady: true, cwd: cwd, firmwareFiles: files})
    eventLoop()
  })
  // sharedStore.setState({})
})
