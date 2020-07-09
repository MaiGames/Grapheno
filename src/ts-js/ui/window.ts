import {app, BrowserWindow} from 'electron'

export default class Window {

    b_window!: BrowserWindow

    preload!: string

    constructor() { }
    
    createWindow(title: string, width: number, height: number, preload: string, showUntilLoaded = true, frame = true, hidden=true, maximize=false, minResMultiplier=0.5) {
        
        this.preload = preload

        this.b_window = new BrowserWindow({
            width: width,
            height: height,
            show: !hidden,
            frame: frame,
            transparent: hidden,
            webPreferences: {
                preload: preload,
                nodeIntegration: true,
                enableRemoteModule: true
            }
        })

        this.b_window.setTitle(title)

        this.b_window.setMenuBarVisibility(false)

        this.b_window.setMinimumSize(Math.round(width * minResMultiplier), Math.round(height * minResMultiplier))

        if(showUntilLoaded) {
            const win = this.b_window
            this.b_window.webContents.on('did-finish-load', function() {
                if(maximize) win.maximize()
                win.show();
            });
        }

    }

    load(path: string){
        this.b_window.loadURL(path)
    }

    setBGColor(color: string){
        this.b_window.setBackgroundColor(color)
    }

}