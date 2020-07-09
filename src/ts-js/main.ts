require('v8-compile-cache') //optimization

import { ipcMain, app, BrowserWindow } from 'electron'
import * as path from 'path'

import Window from './ui/window'
import DialogWindow from './ui/dialog_window'

import Lang from './util/lang' 
import Theme from './util/theme'

import * as global_vars from './global';
import { IHash } from './util/interfaces'

const editorWindow = new Window()
const startFrame = new DialogWindow()

var globals: IHash

const lang = new Lang()
const theme = new Theme()

function init() {

  globals = global_vars.initGlobalMain(ipcMain).globals

  globals["console"] = console

  editorWindow.createWindow("", 960, 720, path.join(__dirname, '/preload.js'), true, false, true, true, 0.7)
  //startFrame.createDialog("", 800, 600, editorWindow, false, false, true, true, 1)

  editorWindow.b_window.webContents.toggleDevTools()

  editorWindow.load(path.join(__dirname, '../html/editor.html'))
  editorWindow.b_window.setIcon(path.join(__dirname, "../../assets/ico-256.png"))

}

ipcMain.on("open-starthub", () => {

  //startFrame.setBGColor(theme.getCurrThemeColor("dialogs_bgcolor").toHexString())

  //startFrame.window.toggleDevTools()

  //startFrame.load(path.join(__dirname, '../html/start_hub.html'))

})

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