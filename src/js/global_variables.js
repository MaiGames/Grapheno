const { ipcRenderer, remote } = require('electron');

const cache = {}

module.exports.registerMainProcessEvts = (ipcMain) => {

    ipcMain.on("setGlobalVar", (event, globalProperty, value) => {

        global[globalProperty] = value
        console.log("Changed/defined value of global var '"+ globalProperty +"' in main process")
      
    })
    
    ipcMain.on("defGlobalModule", (event, name, module) => {

        global[name] = require(module)        

        console.log("Changed/defined value of global module '"+ name +"' in main process")
      
    })

}

module.exports.getGlobal = (field) => {
    cache[field] = remote.getGlobal(field)
    return cache[field]
}


module.exports.getCachedGlobal = (field) => {
    if(cache[field] == null) return this.getGlobal(field)
    return cache[field]
}

/**
 * Async way to set the value of a global variable, since it is defined in the main process
 */
module.exports.setGlobal = (field, value) => {
    ipcRenderer.send("setGlobalVar", field, value)
    cache[field] = value
}

/**
 * Sync way to set the value of a global variable, since it is defined in the main process
 */
module.exports.setGlobalSync = (field, value) => {
    cache[field] = value
    ipcRenderer.sendSync("setGlobalVar", field, value)
}

/**
 * Async way to set the value of a global variable, since it is defined in the main process
 */
module.exports.setGlobalIfUndefined = (field, func) => {
    if(remote.getGlobal(field) == undefined){
        cache[field] = func()
        ipcRenderer.send("setGlobalVar", field, cache[field])
    }
}

/**
 * Sync way to set the value of a global variable, since it is defined in the main process
 */
module.exports.setGlobalIfUndefinedSync = (field, value) => {
    if(remote.getGlobal(field) == undefined){
        cache[field] = value
        ipcRenderer.sendSync("setGlobalVar", field, value)
    }
}

module.exports.globalRequire = function(module) {

    const varname = "modulereq_" + module

    const glob = remote.getGlobal(varname)

    if(cache[varname] != null) {

        return cache[varname]

    }else if(glob == null){

        ipcRenderer.send("defGlobalModule", varname, module)

        cache[varname] = remote.getGlobal(varname)
        return cache[varname]

    } else {

        cache[varname] = glob
        return cache[varname]

    }

}

module.exports.mainRequire = function(module) {

    const varname = "modulereq_" + module
    
    global[varname] = require(module)

    return global[varname]

}