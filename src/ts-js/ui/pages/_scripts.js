const {ipcRenderer, remote} = require('electron')
const path = require('path')
const fs = require('fs')

const con = remote.getGlobal('console')

function changeHTML(p) {
    remote.getCurrentWindow().loadURL(path.join(__dirname, p))
}