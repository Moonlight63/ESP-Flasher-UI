import type { StoreGeneric } from 'pinia'
// import produce, { applyPatches, Patch, enablePatches } from 'immer';
import {
  ipcRenderer,
  // IpcRenderer,
  // IpcRendererEvent,
} from 'electron';
import { safeStringify } from './utils';
// import { PiniaCustomStateProperties, _UnwrapAll } from 'pinia';
// import { Ref, ComputedRef } from 'vue';
// import { Objectish } from 'immer/dist/internal';

// enablePatches();

// interface IChangePack {
//   patches: Patch[];
//   description?: string;
//   senderId?: number;
// }

// const mainStore = useMainStore()

// createSharedStore(mainStore)

export function createSharedStore(piniaStore: StoreGeneric) {
  // let innerState = state;
  // let lastChange: IChangePack = { patches: [] };
//   let listeners: ((state: Objectish, description?: string) => void)[] = [];

  // const connected = new Set<number>(); // this is only for main process
  // const isRenderer = process?.type === 'renderer';
  // const ipcModule = ipcRenderer;
  const INTERNAL_CHANNEL = '@@ELECTRON_SHARED_STORE_IPC_CHANNEL';

  // let isUpdating = false;

  let lastChange = false;

  piniaStore.$subscribe((mutation, state) => {
    console.log("🚀 ~ file: sharedState.ts ~ line 40 ~ piniaStore.$subscribe ~ mutation", mutation)
    // console.log(mutation)
    // console.log(state);

    // console.time("test")

    // const json = JSON.parse(safeStringify(state))

    // console.timeEnd("test")

    // console.time("test2")
    // console.log(JSON.parse(JSON.stringify(state)));
    // console.timeEnd("test2")
    

    // console.log(json);
    if (!lastChange)
      window.electron.ipcRenderer.send(INTERNAL_CHANNEL, JSON.parse(safeStringify(state)))
    lastChange = false
  })


  window.electron.ipcRenderer.on(INTERNAL_CHANNEL, (event, change) => {
    // console.log("🚀 ~ file: sharedState.ts ~ line 62 ~ window.electron.ipcRenderer.on ~ event", event)
    lastChange = true
    // if(!JSON.parse(safeStringify(state)) == change)
    Object.keys(change).forEach(element => {
      console.log(element);
      console.log(change[element]);
    });
    console.log("🚀 ~ file: sharedState.ts ~ line 65 ~ window.electron.ipcRenderer.on ~ change", change)
      piniaStore.$patch(change)
  })

//   ipcModule.on(
//     INTERNAL_CHANNEL,
//     (event: IpcRendererEvent, change: IChangePack) => {
//       if (change.patches.length === 0) {
//         return;
//       }

//       isUpdating = true;

//       const nextState = applyPatches(innerState, change.patches);
//       lastChange = {
//         ...change,
//         senderId: -1, // renderer always receives from main so let's say id is -1
//       };

//       broadcastChange();

//       innerState = nextState;

//       isUpdating = false;

//       for (let i = 0; i < listeners.length; i++) {
//         const listener = listeners[i];
//         listener(innerState, change.description);
//       }
//     }
//   );

  // function broadcastChange() {
  //   if (lastChange.patches.length === 0) {
  //     return;
  //   }

  //   if (isRenderer) {
  //     // if lastChange was from main, we don't send it to main again
  //     lastChange.senderId !== -1 &&
  //       (ipcModule as IpcRenderer).send(INTERNAL_CHANNEL, lastChange);
  //   }
  // }

  // function setState(recipe: (draft: Objectish) => void, description?: string) {
  //   isUpdating = true;

  //   const nextState = produce(innerState, recipe, (patches) => {
  //     lastChange = { patches, description };
  //   });

  //   broadcastChange();

  //   innerState = nextState;
  //   isUpdating = false;

  //   for (let i = 0; i < listeners.length; i++) {
  //     const listener = listeners[i];
  //     listener(innerState, lastChange.description);
  //   }

  //   return nextState;
  // }

  // function getState(): Objectish {
  //   if (isUpdating) {
  //     throw new Error(
  //       'You may not call store.getState() inside setState method. ' +
  //         'It has already received the state as an argument. '
  //     );
  //   }

  //   return innerState;
  // }

  // function subscribe(listener: (state: Objectish, description?: string) => void) {
  //   if (typeof listener !== 'function') {
  //     throw new Error('Expected the listener to be a function.');
  //   }

  //   if (isUpdating) {
  //     throw new Error(
  //       'You may not call store.subscribe() inside store.setState(). '
  //     );
  //   }

  //   listeners.push(listener);

  //   // run once for the first time for every one who just subscribed
  //   listener(innerState, lastChange.description);

  //   return function unsubscribe() {
  //     if (isUpdating) {
  //       throw new Error(
  //         'You may not unsubscribe from a store listener while the state is updating. '
  //       );
  //     }

  //     const index = listeners.indexOf(listener);
  //     listeners.splice(index, 1);
  //   };
  // }

  // if (isRenderer) {
  //   // send empty change to main, so main process can save the senderId
  //   (ipcModule as IpcRenderer).send(INTERNAL_CHANNEL, {
  //     patches: [],
  //   });
  // }

  // return { setState, getState, subscribe };
}