const {ipcRenderer, remote} = require('electron');

exports.getGlobal = (field) => {
    return remote.getGlobal(field)
}

/**
 * Async way to set the value of a global variable, since it is defined in the main process
 */
exports.setGlobal = (field, value) => {
    ipcRenderer.send("setGlobalVar", field, value)
}

/**
 * Sync way to set the value of a global variable, since it is defined in the main process
 */
exports.setGlobalSync = (field, value) => {
    ipcRenderer.sendSync("setGlobalVar", field, value)
}

/**
 * Async way to set the value of a global variable, since it is defined in the main process
 */
exports.setGlobalIfUndefined = (field, value) => {
    if(remote.getGlobal(field) == undefined) ipcRenderer.send("setGlobalVar", field, value)
}

/**
 * Sync way to set the value of a global variable, since it is defined in the main process
 */
exports.setGlobalIfUndefinedSync = (field, value) => {
    if(remote.getGlobal(field) == undefined) ipcRenderer.sendSync("setGlobalVar", field, value)
}