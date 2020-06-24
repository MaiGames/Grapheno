const PIXI = require('pixi.js')
const install = require('@pixi/unsafe-eval').install

const gh_grid = require('../js/graphics/grid')

const array_util = require('../js/util/array_util')
const global_vars = require('../js/util/global_variables');

var pix_app;

const rects = [];

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

    var width = window.innerWidth;
    var height = window.innerHeight;

    //const pos = [pix_app.renderer.plugins.interaction.mouse.global.x, pix_app.renderer.plugins.interaction.mouse.global.y]

    var grid = new gh_grid.Grid({
        vpw: 300,
        vph: 300,
        offset: [-1, 1 ],
        pitch: [25, 25],
        resolution: [ 300, 300 ],
        line_color: [1, 1, 1, 0.5]
    })

    //pix_app.viewport.filterArea = pix_app.renderer.screen

    pix_app.stage.addChild(grid.getRect())

    resize()

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
    pix_app.renderer.resize(window.innerWidth-0, window.innerHeight-0);

}