const PIXI = require('pixi.js')
const install = require('@pixi/unsafe-eval').install
const tinycolor = require('tinycolor2')

const pixel_canvas = require('../js/graphics/canvas/pixel_canvas')

const array_util = require('../js/util/array_util')
const global_vars = require('../js/global_variables');
const theme = global_vars.getCachedGlobal('theme')

var pix_app = null
var canvas = null

remote.getCurrentWindow().on("first-init", (evt) => {

    ipcRenderer.send("open-starthub")

})

remote.getCurrentWindow().on("finish-init-preload", (event) => {

    install(PIXI) //apply patch for unsafe-eval

    pix_app = new PIXI.Application({
      autoResize: true,
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
    
    canvas = new pixel_canvas.PixelCanvas(pix_app, window, {

        sqs_width: 20,
        sqs_height: 20,
        rect_width: 600,
        rect_height: 600,

        grid_linecolor: theme.getCurrThemeColor("canvas_grid_linecolor"),
        grid_border_linecolor: theme.getCurrThemeColor("canvas_grid_border_linecolor")
    
    })

    canvas.init()

    document.getElementsByTagName("canvas")[0].addEventListener("wheel", (event) => {
        canvas.scroll(Math.round(canvas.grid.getPosition()[0] + event.deltaX), 
                      Math.round(canvas.grid.getPosition()[1] + event.deltaY))
    })

})


remote.getCurrentWindow().on("close-btt", (evt) => {

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