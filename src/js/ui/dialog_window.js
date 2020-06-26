const {app, BrowserWindow} = require('electron')

class DialogWindow {

    window = null

    constructor() { }
    
    createDialog(title, width, height, parent, showUntilLoaded = true, frame = true, resizable=false, hidden=true, minResMultiplier=0.5) {
        this.window = new BrowserWindow({
            title: title,
            width: width,
            height: height,
            show: !hidden,
            modal: true,
            parent: parent.window,
            frame: frame,
            fullscreen: false,
            maximizable: resizable,
            webPreferences: {
                preload: parent.preload,
                nodeIntegration: true,
                transparent: true,
                enableRemoteModule: true
            }
        })

        this.window.setMenuBarVisibility(false)

        this.window.setMinimumSize(width * minResMultiplier, height * minResMultiplier)

        this.window.setResizable(resizable)

        const win = this.window

        const fullScreenInter = setInterval(function() {
            if(!win.isDestroyed()) { 
                win.setFullScreen(false)
            } else {
                clearInterval(fullScreenInter)
            }
        }, 1)

        if(showUntilLoaded) {
            
            const win = this.window

            this.window.webContents.on('did-finish-load', function() {
                if(!parent.isDestroyed()) win.show();
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

module.exports.DialogWindow = DialogWindow