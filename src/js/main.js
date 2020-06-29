require('v8-compile-cache') //optimization

const { ipcMain, app, BrowserWindow } = require('electron')
const path = require('path')

const win = require('./ui/window')
const dialogWin = require('./ui/dialog_window')

const globalVars = require('./util/global_variables')
const lang = require('./util/lang')
const theme = require('./util/theme')

const editorWindow = new win.Window()
const startFrame = new dialogWin.DialogWindow()

function init() {

  global.console = console

  loadLang()
  loadTheme()

  globalVars.registerMainProcessEvts(ipcMain)

  editorWindow.createWindow("", 960, 720, path.join(__dirname, '/preload.js'), true, false, true, true, 0.7)
  startFrame.createDialog("", 800, 600, editorWindow, false, false, true, true, 1)

  editorWindow.window.toggleDevTools()

  editorWindow.setBGColor(theme.getCurrThemeColor("editor_bgcolor").toHexString())
  editorWindow.load(path.join(__dirname, '../html/editor.html'))
  editorWindow.window.setIcon(path.join(__dirname, "../../assets/ico-256.png"))

  global.editorWindow = editorWindow
  global.startFrame = startFrame

}

function loadLang() {

  lang.loadLang(path.join(__dirname, "../../assets/lang/en_US.json"), "en_US")
  lang.loadLang(path.join(__dirname, "../../assets/lang/fr_FR.json"), "fr_FR")

  lang.setLang("en_US")

  global.lang = lang

}

function loadTheme() {

  theme.loadTheme(path.join(__dirname, "../../assets/theme/dark_darcula.json"), "dark_darcula")

  theme.setTheme("dark_darcula")

  global.theme = theme

}


ipcMain.on("open-starthub", () => {

  startFrame.setBGColor(theme.getCurrThemeColor("dialogs_bgcolor").toHexString())

  //startFrame.window.toggleDevTools()

  startFrame.load(path.join(__dirname, '../html/start_hub.html'))

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