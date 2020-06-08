const remote = require('electron').remote
const path = require('path')
const con = require('electron').remote.getGlobal('console')

function changeHTML(p) {
    remote.getCurrentWindow().loadURL(path.join(__dirname, p))
}