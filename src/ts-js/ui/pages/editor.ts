const PIXI = require('pixi.js')
const install = require('@pixi/unsafe-eval').install

import PixelCanvas from '../../graphics/canvas/pixel_canvas'

import * as globals from '../../global'
import { remote } from 'electron'

const manager = globals.getCachedGlobal('general_manager')

var pix_app: PIXI.Application
var canvas: PixelCanvas

manager.eventEmitter.on("finish-init-preload", () => {

    install(PIXI) //apply patch for unsafe-eval

    pix_app = new PIXI.Application({
      transparent: true,
      resolution: devicePixelRatio
    });
    
    document.body.appendChild(pix_app.view);

    // Listen for window resize events
    window.onresize = resize

    window.onmousemove = function() {

        const pos = [pix_app.renderer.plugins.interaction.mouse.global.x, pix_app.renderer.plugins.interaction.mouse.global.y]

    }

    resize()
    
    canvas = new PixelCanvas(pix_app, window, {

        sqs_width: 20,
        sqs_height: 20,
        rect_width: 600,
        rect_height: 600,

        grid_linecolor: manager.theme.getCurrThemeColor("canvas_grid_linecolor"),
        grid_border_linecolor: manager.theme.getCurrThemeColor("canvas_grid_border_linecolor")
    
    })

    canvas.init()

    document.getElementsByTagName("canvas")[0].addEventListener("wheel", (event: WheelEvent) => {
        canvas.scroll(Math.round(canvas.grid.getPosition()[0] + event.deltaX), 
                      Math.round(canvas.grid.getPosition()[1] + event.deltaY))
    })

})

manager.eventEmitter.on("close-btt", () => {

    remote.getCurrentWindow().hide()

    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') request_quit()

})

function request_quit() {

    remote.app.quit()

}

// Resize function window
function resize() {

    // Resize the renderer
    pix_app.renderer.resize(window.innerWidth, window.innerHeight)
    
}