const PIXI = require('pixi.js')
const install = require('@pixi/unsafe-eval').install


remote.getCurrentWindow().on("first-init", (evt) => {

    ipcRenderer.send("open-starthub")

})

remote.getCurrentWindow().on("finish-init-preload", (event) => {

    install(PIXI) //apply patch for unsafe-eval

    //Create a Pixi Application
    let app = new PIXI.Application({width: 256, height: 256});

    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);

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