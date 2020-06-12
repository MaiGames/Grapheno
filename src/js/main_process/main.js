const {ipcMain, app, BrowserWindow} = require('electron')
const win = require('./window')
const dialogWin = require('./dialog_window')

var path = 0

require('v8-compile-cache') //optimization

const editorWindow = new win.Window()

const startFrame = new dialogWin.DialogWindow()

function init() {

  const globalVars = require('../util/across_global_variables')
  path = require('path')

  loadLang()

  globalVars.registerMainProcessEvts(ipcMain)

  editorWindow.createWindow("Grapheno", 800, 600, path.join(__dirname, '../preload.js'), true, false, true, 0.7)

  startFrame.createDialog(800, 600, "Grapheno - Start Hub", editorWindow, true, false, false, 1)

  editorWindow.setBGColor("#1E1E1E")

  editorWindow.load(path.join(__dirname, '../../html/editor.html'))

  editorWindow.window.setIcon(path.join(__dirname, "../../../assets/ico-256.png"))

}

function loadLang() {

  const lang = require('../util/lang')

  lang.loadLang(path.join(__dirname, "../../../assets/lang/en_US.json"), "en_US")

  lang.setLang("en_US")

  global.lang = lang;

  global.console = console

}

ipcMain.on("open-starthub", () => {

  startFrame.setBGColor("#1E1E1E")

  startFrame.load(path.join(__dirname, '../../html/start_hub.html'))

  startFrame.window.toggleDevTools()

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

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})