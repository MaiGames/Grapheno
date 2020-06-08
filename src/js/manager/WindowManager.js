const {app, BrowserWindow} = require('electron')

class WindowManager {

    window = null

    constructor() { }
    
    createWindow(title, width, height, preload, showUntilLoaded, frame) {
        this.window = new BrowserWindow({
            width: width,
            height: height,
            show: !showUntilLoaded,
            frame: frame,
            webPreferences: {
                preload: preload,
                nodeIntegration: true,
                transparent: true,
                enableRemoteModule: true
            }
        })

        this.window.setTitle(title)

        this.window.setMenuBarVisibility(false)

        if(showUntilLoaded) {
            const win = this.window
            this.window.webContents.on('did-finish-load', function() {
                win.show();
            });
        }

    }

    load(path){
        this.window.loadURL(path)
    }

    setBGColor(color){
        this.window.setBackgroundColor(color)
    }

}

module.exports.WindowManager = WindowManager