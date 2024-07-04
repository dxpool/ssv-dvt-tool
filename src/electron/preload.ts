// preload.ts
/**
 * This typescript file contains the API used by the UI to call the electron modules.
 */

import {
  contextBridge,
  ipcRenderer,
} from "electron";

import {
  IBashUtilsAPI,
  IElectronAPI,
  IEth2DepositAPI,
  IWeb3UtilsAPI,
  ISSVKeysAPI,
} from "./renderer";

contextBridge.exposeInMainWorld('electron', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
});

contextBridge.exposeInMainWorld('electronAPI', {
  'clipboardWriteText': (...args: Parameters<IElectronAPI['clipboardWriteText']>) => ipcRenderer.send('clipboardWriteText', ...args),
  'invokeShowOpenDialog': (...args: Parameters<IElectronAPI['invokeShowOpenDialog']>) => ipcRenderer.invoke('showOpenDialog', ...args),
  'ipcRendererSendClose': () => ipcRenderer.send('close'),
  'shellShowItemInFolder': (...args: Parameters<IElectronAPI['shellShowItemInFolder']>) => ipcRenderer.send('shellShowItemInFolder', ...args),
  'openLink': (url: string) => ipcRenderer.send('open-link', url),
  'clearCache': () => ipcRenderer.send('clear-cache'),
});

contextBridge.exposeInMainWorld('eth2Deposit', {
  'createMnemonic': (...args: Parameters<IEth2DepositAPI['createMnemonic']>) => ipcRenderer.invoke('createMnemonic', ...args),
  'generateBLSChange': (...args: Parameters<IEth2DepositAPI['generateBLSChange']>) => ipcRenderer.invoke('generateBLSChange', ...args),
  'generateKeys': (...args: Parameters<IEth2DepositAPI['generateKeys']>) => ipcRenderer.invoke('generateKeys', ...args),
  'generateKeysAndKeystore': (...args: Parameters<IEth2DepositAPI['generateKeysAndKeystore']>) => ipcRenderer.invoke('generateKeysAndKeystore', ...args),
  'validateBLSCredentials': (...args: Parameters<IEth2DepositAPI['validateBLSCredentials']>) => ipcRenderer.invoke('validateBLSCredentials', ...args),
  'validateMnemonic': (...args: Parameters<IEth2DepositAPI['validateMnemonic']>) => ipcRenderer.invoke('validateMnemonic', ...args),
});

contextBridge.exposeInMainWorld('bashUtils', {
  'doesDirectoryExist': (...args: Parameters<IBashUtilsAPI['doesDirectoryExist']>) => ipcRenderer.invoke('doesDirectoryExist', ...args),
  'findFirstFile': (...args: Parameters<IBashUtilsAPI['findFirstFile']>) => ipcRenderer.invoke('findFirstFile', ...args),
  'isDirectoryWritable': (...args: Parameters<IBashUtilsAPI['isDirectoryWritable']>) => ipcRenderer.invoke('isDirectoryWritable', ...args),
});

contextBridge.exposeInMainWorld('web3Utils', {
  'isAddress': (...args: Parameters<IWeb3UtilsAPI['isAddress']>) => ipcRenderer.invoke('isAddress', ...args),
});

contextBridge.exposeInMainWorld('ssvKeys', {
  'splitKeystore': (...args: Parameters<ISSVKeysAPI['splitKeystore']>) => ipcRenderer.invoke('splitKeystore', ...args),
  'getUserKeys': (...args: Parameters<ISSVKeysAPI['getUserKeys']>) => ipcRenderer.invoke('getUserKeys', ...args),
  'saveShareFile': (...args: Parameters<ISSVKeysAPI['saveShareFile']>) => ipcRenderer.invoke('saveShareFile', ...args),
  'getAddressNonce': (...args: Parameters<ISSVKeysAPI['getAddressNonce']>) => ipcRenderer.invoke('getAddressNonce', ...args),
});
