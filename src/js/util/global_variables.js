module.exports.registerMainProcessEvts = (ipcMain) => {
    ipcMain.on("setGlobalVar", (event, globalProperty, value) => {

        global[globalProperty] = value
        console.log("Changed/defined value of global var '"+ globalProperty +"' in main process")
      
    })  
}

module.exports.getGlobal = (field) => {
    return remote.getGlobal(field)
}

/**
 * Async way to set the value of a global variable, since it is defined in the main process
 */
module.exports.setGlobal = (field, value) => {
    ipcRenderer.send("setGlobalVar", field, value)
}

/**
 * Sync way to set the value of a global variable, since it is defined in the main process
 */
module.exports.setGlobalSync = (field, value) => {
    ipcRenderer.sendSync("setGlobalVar", field, value)
}

/**
 * Async way to set the value of a global variable, since it is defined in the main process
 */
module.exports.setGlobalIfUndefined = (field, value) => {
    if(remote.getGlobal(field) == undefined) ipcRenderer.send("setGlobalVar", field, value)
}

/**
 * Sync way to set the value of a global variable, since it is defined in the main process
 */
module.exports.setGlobalIfUndefinedSync = (field, value) => {
    if(remote.getGlobal(field) == undefined) ipcRenderer.sendSync("setGlobalVar", field, value)
}