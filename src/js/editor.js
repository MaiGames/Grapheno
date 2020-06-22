const PIXI = require('pixi.js')
const install = require('@pixi/unsafe-eval').install

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
      
    // Lets create a red square, this isn't 
    // necessary only to show something that can be position
    // to the bottom-right corner
//    rects.push(new PIXI.Graphics()
//                .beginFill(0xff0000)
//                .drawRect(-100, -100, 100, 100))

    // Add it to the stage
//    pix_app.stage.addChild(rects[0]);
    
    // Listen for window resize events
    window.onresize = resize

    pix_app.renderer.plugins.interaction.on("mousedown", function(e){

        const rect = new PIXI.Graphics()
        .beginFill(0xff0000)
        .drawRect(-100, -100, 100, 100);

        rect.position.set(pix_app.renderer.plugins.interaction.mouse.global.x, pix_app.renderer.plugins.interaction.mouse.global.y);

        rects.push(rect)

        pix_app.stage.addChild(rect)

    })
    
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
    
    for(rect of rects) {

        // You can use the 'screen' property as the renderer visible
        // area, this is more useful than view.width/height because
        // it handles resolution
        //rect.position.set(renderer.interaction.mouse.global, pix_app.screen.height);

    }

}