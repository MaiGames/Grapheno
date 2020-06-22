const {ipcMain, app, BrowserWindow} = require('electron')
const win = require('./window')
const dialogWin = require('./dialog_window')

const lang = require('../util/lang')

const theme = require('../util/theme')

var path = 0

require('v8-compile-cache') //optimization

const editorWindow = new win.Window()

const startFrame = new dialogWin.DialogWindow()

function init() {

  global.console = console

  const globalVars = require('../util/across_global_variables')
  path = require('path')

  loadLang()
  loadTheme()

  globalVars.registerMainProcessEvts(ipcMain)

  editorWindow.createWindow("", 800, 600, path.join(__dirname, '../preload.js'), true, false, true, true, 0.7)

  startFrame.createDialog("", 800, 600, editorWindow, false, false, true, true, 1)

  editorWindow.setBGColor(theme.getCurrThemeColor("editor_bgcolor"))

  //editorWindow.window.toggleDevTools()

  editorWindow.load(path.join(__dirname, '../../html/editor.html'))

  editorWindow.window.setIcon(path.join(__dirname, "../../../assets/ico-256.png"))

  global.editorWindow = editorWindow
  global.startFrame = startFrame

}

function loadLang() {

  lang.loadLang(path.join(__dirname, "../../../assets/lang/en_US.json"), "en_US")
  lang.loadLang(path.join(__dirname, "../../../assets/lang/fr_FR.json"), "fr_FR")

  lang.setLang("fr_FR")

  global.lang = lang

}

function loadTheme() {

  theme.loadTheme(path.join(__dirname, "../../../assets/theme/dark_darcula.json"), "dark_darcula")

  theme.setTheme("dark_darcula")

  global.theme = theme;

}


ipcMain.on("open-starthub", () => {

  startFrame.setBGColor(theme.getCurrThemeColor("editor_bgcolor"))

  //startFrame.window.toggleDevTools()

  startFrame.load(path.join(__dirname, '../../html/start_hub.html'))

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