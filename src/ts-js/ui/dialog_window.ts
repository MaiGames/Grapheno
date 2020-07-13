import { app, BrowserWindow } from 'electron'
import Window from './window'

export default class DialogWindow {

    window!: BrowserWindow

    constructor() { }
    
    createDialog(title: string, width: number, height: number, parent: Window, showUntilLoaded = true, frame = true, resizable=false, hidden=true, minResMultiplier=0.5) {
        this.window = new BrowserWindow({
            title: title,
            width: width,
            height: height,
            show: !hidden,
            modal: true,
            parent: parent.b_window,
            frame: frame,
            fullscreen: false,
            transparent: true,
            maximizable: resizable,
            webPreferences: {
                preload: parent.preload,
                nodeIntegration: true,
                enableRemoteModule: true
            }
        })

        this.window.setMenuBarVisibility(false)

        this.window.setMinimumSize(width * minResMultiplier, height * minResMultiplier)

        this.window.setResizable(resizable)

        const win = this.window

        const fullScreenInterval = setInterval(function() {

            if(!win.isDestroyed())
                win.setFullScreen(false)
            else
                clearInterval(fullScreenInterval)

        }, 1)

        if(showUntilLoaded) {
            
            const win = this.window

            this.window.webContents.on('did-finish-load', function() {
                if(!parent.b_window.isDestroyed()) win.show();
            });

        }

    }

    load(path: string){
        this.window.loadURL(path)
    }

    setBGColor(color: string){
        this.window.setBackgroundColor(color)
    }

}