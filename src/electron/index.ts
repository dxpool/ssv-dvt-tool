// index.ts
/**
 * This typescript file contains the Electron app which renders the React app.
 */
import {
  BrowserWindow,
  app,
  clipboard,
  dialog,
  ipcMain,
  shell,
  globalShortcut,
  session
} from "electron";

import { OpenDialogOptions } from "electron/common";
import { accessSync, constants } from "fs";
import path from "path";
import { isAddress } from "web3-utils";
import { splitKeystoreFile, getUserKeys, saveShareFile } from "./SSVUtils";

import {
  doesDirectoryExist,
  findFirstFile,
  isDirectoryWritable,
} from "./BashUtils";
import {
  createMnemonic,
  generateBLSChange,
  generateKeys,
  generateKeysAndKeystore,
  validateBLSCredentials,
  validateMnemonic,
} from "./Eth2Deposit";

const crypto = require('crypto');
global.crypto = crypto;

/**
 * VERSION and COMMITHASH are set by the git-revision-webpack-plugin module.
 */
declare var VERSION: string;
declare var COMMITHASH: string;

const doesFileExist = (filename: string): boolean => {
  try {
    accessSync(filename, constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

app.on("ready", () => {
  var iconPath = path.join("static", "icon.svg");
  const bundledIconPath = path.join(process.resourcesPath, "..", "static", "icon.svg");

  if (doesFileExist(bundledIconPath)) {
    iconPath = bundledIconPath;
  }

  const title = `${app.getName()} ${VERSION}-${COMMITHASH}`;

  /**
   * Create the window in which to render the React app
   */
  const window = new BrowserWindow({
    width: 1279,
    height: 780,
    icon: iconPath,
    title: title,
    backgroundColor: '#F5F5F5',
    frame: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  
  /**
   * Hide the default menu bar that comes with the browser window
   */
  window.setMenuBarVisibility(false);

  /**
   * Set the Permission Request Handler to deny all permissions requests
   */
  window.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    return callback(false);
  });

  /**
   * Register global shortcuts to disable refresh
   */
  globalShortcut.register('CommandOrControl+R', () => {});

  globalShortcut.register('CommandOrControl+Shift+R', () => {});

  /**
   * This logic closes the application when the window is closed, explicitly.
   * On MacOS this is not a default feature.
   */
  ipcMain.on('close', () => {
    app.quit();
  });

  /**
   * Will grab the provide text and copy to the cipboard
   */
  ipcMain.on('clipboardWriteText', (evt, ext, type) => {
    clipboard.writeText(ext, type);
  });

  /**
   * Will open a file explorer to the path provided
   */
  ipcMain.on('shellShowItemInFolder', (event, fullPath: string) => {
    shell.showItemInFolder(fullPath);
  });

  /**
   * Provides the renderer a way to call the dialog.showOpenDialog function using IPC.
   */
  ipcMain.handle('showOpenDialog', async (event, options: OpenDialogOptions) => {
    return await dialog.showOpenDialog(options);
  });

  ipcMain.on('window-minimize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window?.minimize();
  });
  
  ipcMain.on('window-maximize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window?.isMaximized()) {
      window.unmaximize();
    } else {
      window?.maximize();
    }
  });
  
  ipcMain.on('window-close', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window?.close();
  });


  const clearAppCache = () => {
    session.defaultSession.clearCache().then(() => {}).catch(() => {});
  };

  ipcMain.on('clear-cache', (event) => {
    clearAppCache();
  });

  ipcMain.on('open-link', (event, arg) => {
    shell.openExternal(arg);
  });

  /**
   * Passthroughs for non-electron renderer calls
   */
  ipcMain.handle('createMnemonic', async (event, ...args: Parameters<typeof createMnemonic>) => {
    return await createMnemonic(...args);
  });
  ipcMain.handle('generateBLSChange', async (event, ...args: Parameters<typeof generateBLSChange>) => {
    return await generateBLSChange(...args);
  });
  ipcMain.handle('generateKeysAndKeystore', async (event, ...args: Parameters<typeof generateKeys>) => {
    return await generateKeysAndKeystore(...args);
  });
  ipcMain.handle('generateKeys', async (event, ...args: Parameters<typeof generateKeys>) => {
    return await generateKeys(...args);
  });
  ipcMain.handle('validateBLSCredentials', async (event, ...args: Parameters<typeof validateBLSCredentials>) => {
    return await validateBLSCredentials(...args);
  });
  ipcMain.handle('validateMnemonic', async (event, ...args: Parameters<typeof validateMnemonic>) => {
    return await validateMnemonic(...args);
  });
  ipcMain.handle('doesDirectoryExist', async (event, ...args: Parameters<typeof doesDirectoryExist>) => {
    return await doesDirectoryExist(...args);
  });
  ipcMain.handle('isDirectoryWritable', async (event, ...args: Parameters<typeof isDirectoryWritable>) => {
    return await isDirectoryWritable(...args);
  });
  ipcMain.handle('findFirstFile', async (event, ...args: Parameters<typeof findFirstFile>) => {
    return await findFirstFile(...args);
  });
  ipcMain.handle('isAddress', async (event, ...args: Parameters<typeof isAddress>) => {
    return isAddress(...args);
  });

  ipcMain.handle('getUserKeys', async (event, ...args: Parameters<typeof getUserKeys>) => {
    return await getUserKeys(...args);
  });

  ipcMain.handle('splitKeystore', async (event, ...args: Parameters<typeof splitKeystoreFile>) => {
    return await splitKeystoreFile(...args);
  });

  ipcMain.handle('saveShareFile', async (event, ...args: Parameters<typeof saveShareFile>) => {
    return saveShareFile(...args);
  });

  /**
   * Load the react app
   */
  window.loadURL(`file://${__dirname}/../react/index.html`);
});

app.on('will-quit', () => {
  /**
   * Clear clipboard on quit to avoid access to any mnemonic or password that was copied during
   * application use.
   */
  clipboard.clear();
})
