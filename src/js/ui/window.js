const {app, BrowserWindow} = require('electron')

class Window {

    window = null

    preload = null

    constructor() { }
    
    createWindow(title, width, height, preload, showUntilLoaded = true, frame = true, hidden=true, maximize=false, minResMultiplier=0.5) {
        
        this.preload = preload

        this.window = new BrowserWindow({
            width: width,
            height: height,
            show: !hidden,
            frame: frame,
            webPreferences: {
                preload: preload,
                nodeIntegration: true,
                transparent: hidden,
                enableRemoteModule: true
            }
        })

        this.window.setTitle(title)

        this.window.setMenuBarVisibility(false)

        this.window.setMinimumSize(Math.round(width * minResMultiplier), Math.round(height * minResMultiplier))

        if(showUntilLoaded) {
            const win = this.window
            this.window.webContents.on('did-finish-load', function() {
                if(maximize) win.maximize()
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

module.exports.Window = Window