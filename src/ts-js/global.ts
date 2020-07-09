import { IpcMain, ipcRenderer, remote } from 'electron'
import { IHash } from "./util/interfaces"

import { EventEmitter } from 'events'

const cache: IHash = {}

export function initGlobalMain(ipcMain: IpcMain) {

    ipcMain.on("setGlobalVar", (event, globalProperty: string, value: any) => {

        global[globalProperty] = value
        console.log("Changed/defined value of global var '"+ globalProperty +"' in main process")
      
    })

}

export function getGlobal(field: string) {
    cache[field] = remote.getGlobal(field)
    return cache[field]
}

export function getCachedGlobal(field: string) {
    if(cache[field] == null) return getGlobal(field)
    return cache[field]
}

/**
 * Async way to set the value of a global variable, since it is defined in the main process
 */
export function setGlobal (field: string, value: any) {
    ipcRenderer.send("setGlobalVar", field, value)
    cache[field] = value
}

/**
 * Sync way to set the value of a global variable, since it is defined in the main process
 */
export function setGlobalSync(field: string, value: any) {
    cache[field] = value
    ipcRenderer.sendSync("setGlobalVar", field, value)
}

/**
 * Async way to set the value of a global variable, since it is defined in the main process
 */
export function setGlobalIfUndefined(field: string, func: Function) {
    if(getGlobal(field) == undefined){
        cache[field] = func()
        ipcRenderer.send("setGlobalVar", field, cache[field])
    }
}

/**
 * Sync way to set the value of a global variable, since it is defined in the main process
 */
export function setGlobalIfUndefinedSync(field: string, func: Function) {
    if(getGlobal(field) == undefined){
        cache[field] = func()
        ipcRenderer.sendSync("setGlobalVar", field, cache[field])
    }
}