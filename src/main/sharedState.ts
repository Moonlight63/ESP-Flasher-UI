// import { ipcMain, IpcMainInvokeEvent } from 'electron';
// import produce, { applyPatches, Patch, enablePatches } from 'immer';
import {
  ipcMain,
  webContents,
  IpcMainInvokeEvent,
} from 'electron';
import { Objectish } from 'immer/dist/internal';

// enablePatches();

interface IChangePack {
  patches: Objectish;
  description?: string;
  senderId?: number;
}

export function createSharedStore<T extends Record<string, any>>(state: T) {
  let innerState = state;
  // let lastChange: IChangePack = { patches: [] };
  let lastChange: { change: { [key: string]: any }, senderId?: number, description?: string } = { change: {} };
  let listeners: ((state: T, description?: string) => void)[] = [];

  const connected = new Set<number>(); // this is only for main process
  const INTERNAL_CHANNEL = '@@ELECTRON_SHARED_STORE_IPC_CHANNEL';

  // const RENDER_CHANNEL = '@@ELECTRON_SHARED_STORE_IPC_RENDER_CHANNEL'
  // const MAIN_CHANNEL = '@@ELECTRON_SHARED_STORE_IPC_MAIN_CHANNEL'

  let isUpdating = false;

  ipcMain.on(
    INTERNAL_CHANNEL,
    // (event: IpcMainInvokeEvent, change: IChangePack) => {
    (event: IpcMainInvokeEvent, change: T, desciption: string = "") => {
      const id = (event as IpcMainInvokeEvent).sender.id; // webContent's id
      connected.add(id);
      console.log("🚀 ~ file: sharedState.ts ~ line 33 ~ createSharedStore ~ connected", connected)

      console.log("🚀 ~ file: sharedState.ts ~ line 40 ~ createSharedStore ~ change", change)
      if (Object.keys(change as Objectish).length === 0) {
        return;
      }

      isUpdating = true;

      // const nextState = applyPatches(innerState, change);

      // const nextState = produce(innerState, (draft) => {
      //   console.log("🚀 ~ file: sharedState.ts ~ line 45 ~ nextState ~ draft", draft)
      // })

      lastChange = {
        change: change,
        description: desciption,
        senderId: event.sender.id
      }

      // lastChange = {
      //   // patches: change,
      //   senderId: (event as IpcMainInvokeEvent).sender.id, // renderer always receives from main so let's say id is -1
      // };

      // broadcastChange();

      console.log("🚀 ~ file: sharedState.ts ~ line 59 ~ createSharedStore ~ innerState", innerState)
      
      // innerState = nextState;
      
      innerState = { ...innerState, ...change }
      // console.log(innerState);
      console.log("🚀 ~ file: sharedState.ts ~ line 64 ~ createSharedStore ~ innerState", innerState)

      isUpdating = false;

      for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i];
        listener(innerState, lastChange.description);
      }
    }
  );

  function registerListener(id: number) {
    connected.add(id);
  }

  function broadcastChange() {
    // if (lastChange.patches.length === 0) {
    //   return;
    // }

    // console.log("🚀 ~ file: sharedState.ts ~ line 94 ~ connected.forEach ~ connected", connected)
    

    connected.forEach((id) => {
      // do not broadcast to sender process
      // if (id === lastChange.senderId) {
      //   return;
      // }

      const wc = webContents.fromId(id);
      // console.log("🚀 ~ file: sharedState.ts ~ line 91 ~ connected.forEach ~ wc", wc)
      // console.log("🚀 ~ file: sharedState.ts ~ line 94 ~ connected.forEach ~ innerState", innerState)
      if (wc) {
        wc.send(INTERNAL_CHANNEL, null, innerState);
      }
    });
  }

  // function setState(recipe: (draft: Objectish) => void, description?: string) {
  function setState(newState: T) {
    isUpdating = true;

    // const nextState = produce(innerState, recipe, (patches) => {
    //   lastChange = { patches, description };
    // });
    innerState = { ...innerState, ...newState }

    broadcastChange();

    // innerState = nextState;
    isUpdating = false;

    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener(innerState, lastChange.description);
    }

    // return nextState;
    return innerState;
  }

  function getState(): T {
    if (isUpdating) {
      throw new Error(
        'You may not call store.getState() inside setState method. ' +
          'It has already received the state as an argument. '
      );
    }

    return innerState;
  }

  function subscribe(listener: (state: T, description?: string) => void) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    if (isUpdating) {
      throw new Error(
        'You may not call store.subscribe() inside store.setState(). '
      );
    }

    listeners.push(listener);

    // run once for the first time for every one who just subscribed
    listener(innerState, lastChange.description);

    return function unsubscribe() {
      if (isUpdating) {
        throw new Error(
          'You may not unsubscribe from a store listener while the state is updating. '
        );
      }

      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  // if (isRenderer) {
  //   // send empty change to main, so main process can save the senderId
  //   (ipcModule as IpcRenderer).send(INTERNAL_CHANNEL, {
  //     patches: [],
  //   });
  // }

  return { setState, getState, subscribe, registerListener };
}

// const INTERNAL_CHANNEL = '@@ELECTRON_SHARED_STORE_IPC_CHANNEL';
// const connected = new Set<number>();
// export function createSharedStore() {
//   ipcMain.on(INTERNAL_CHANNEL, (event, data) => {
//     const id = (event as IpcMainInvokeEvent).sender.id; // webContent's id
//     connected.add(id);
//     console.log(data);
//   })
// }