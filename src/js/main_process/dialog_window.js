const {app, BrowserWindow} = require('electron')

class DialogWindow {

    window = null

    constructor() { }
    
    createDialog(width, height, title, parent, showUntilLoaded = true, frame = true, resizable=false, minResMultiplier=0.5) {
        this.window = new BrowserWindow({
            width: width,
            height: height,
            show: !showUntilLoaded,
            modal: true,
            parent: parent.window,
            frame: frame,
            webPreferences: {
                preload: parent.preload,
                nodeIntegration: true,
                transparent: showUntilLoaded,
                enableRemoteModule: true
            }
        })

        this.window.setTitle(title)

        this.window.setMenuBarVisibility(false)

        this.window.setMinimumSize(width * minResMultiplier, height * minResMultiplier)

        this.window.setResizable(resizable)

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

module.exports.DialogWindow = DialogWindow