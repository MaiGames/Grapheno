require('v8-compile-cache') //optimization

import { ipcMain, app, BrowserWindow } from 'electron'
import * as path from 'path'

import Window from './ui/window'

import * as globals from './global';

const editorWindow = new Window()

function init() {

  globals.initGlobalMain(ipcMain)

  global["console"] = console

  editorWindow.createWindow("", 960, 720, path.join(__dirname, '/preload.js'), true, false, true, true, 0.7)

  //editorWindow.b_window.webContents.toggleDevTools()

  editorWindow.load(path.join(__dirname, '../html/editor.html'))
  editorWindow.b_window.setIcon(path.join(__dirname, "../../assets/ico-256.png"))

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  init()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) init()
  })

})