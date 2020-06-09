// Modules to control application life and create native browser window
const {ipcMain, app, BrowserWindow} = require('electron')
const path = require('path')
const win = require('./window')
const globalVars = require('../util/across_global_variables')

require('v8-compile-cache') //optimization

const mainWindow = new win.Window()

function init() {

  globalVars.registerMainProcessEvts(ipcMain)

  mainWindow.createWindow("Grapheno", 800, 600, path.join(__dirname, '../preload.js'), true, false, 0.7)

  mainWindow.setBGColor("#1E1E1E")

  mainWindow.load(path.join(__dirname, '../../html/main_hub.html'))

  mainWindow.window.setIcon(path.join(__dirname, "../../../assets/ico-256.png"))

  mainWindow.window.toggleDevTools()

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

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})