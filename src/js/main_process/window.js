const {app, BrowserWindow} = require('electron')

class Window {

    window = null

    constructor() { }
    
    createWindow(title, width, height, preload, showUntilLoaded = true, frame = true, minResMultiplier = 0.5) {
        this.window = new BrowserWindow({
            width: width,
            height: height,
            show: !showUntilLoaded,
            frame: frame,
            webPreferences: {
                preload: preload,
                nodeIntegration: true,
                transparent: showUntilLoaded,
                enableRemoteModule: true,
            }
        })

        this.window.setTitle(title)

        this.window.setMenuBarVisibility(false)

        this.window.setMinimumSize(width * minResMultiplier, height * minResMultiplier)

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

module.exports.Window = Window