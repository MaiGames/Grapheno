//const path = require('path')
import * as fs from 'fs'
import { IHash } from './interfaces'

const fileStrCache: IHash = {}

export function loadFileStr(path: string) {

    fileStrCache[path] = fs.readFileSync(path).toString()

    return fileStrCache[path]

}

export function loadCachedFileStr(path: string) {

    if(fileStrCache[path] == undefined) fileStrCache[path] = fs.readFileSync(path).toString()

    return fileStrCache[path]

}