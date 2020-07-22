const PIXI = require('pixi.js')
const install = require('@pixi/unsafe-eval').install

import { remote } from 'electron'

import PixelCanvas from '../../graphics/canvas/pixel_canvas'
import * as globals from '../../global'

const manager = globals.getCachedGlobal('general_manager')

var pixi_app: PIXI.Application
var canvas: PixelCanvas

manager.eventEmitter.on("finish-init-preload", () => {

    install(PIXI) //apply patch for unsafe-eval

    pixi_app = new PIXI.Application({
      transparent: true,
      resolution: devicePixelRatio
    });
    
    document.body.appendChild(pixi_app.view);

    // Listen for window resize events
    window.onresize = resize

    resize()
    
    canvas = new PixelCanvas(pixi_app, window, {

        sqs_width: 20,
        sqs_height: 20,
        rect_width: 600,
        rect_height: 600,

        grid_linecolor: manager.theme.getCurrThemeColor("canvas_grid_linecolor"),
        grid_border_linecolor: manager.theme.getCurrThemeColor("canvas_grid_border_linecolor")
    
    })

})

manager.eventEmitter.on("close-btt", () => {

    remote.getCurrentWindow().hide()

    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') remote.app.quit()

})

// Resize function window
function resize() {

    // Resize the renderer
    pixi_app.renderer.resize(window.innerWidth, window.innerHeight)
    
}