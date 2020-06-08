// Modules to control application life and create native browser window
const {ipcMain, app, BrowserWindow} = require('electron')
const path = require('path')
const win = require('./manager/WindowManager')

var mainWindow = new win.WindowManager()

ipcMain.on("setGlobalVar", (event, globalProperty, value) => {

  global[globalProperty] = value
  console.log("Changed/Defined value of global var '"+ globalProperty +"' in main process")

})

function createWindow() {
  
  mainWindow.createWindow("Grapheno", 800, 600, path.join(__dirname, 'preload.js'), true, false)

  mainWindow.setBGColor("#212121")

  mainWindow.load(path.join(__dirname, '../html/index.html'))

  mainWindow.window.setIcon(path.join(__dirname, "../../assets/ico-256.png"))

  mainWindow.window.toggleDevTools()

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})