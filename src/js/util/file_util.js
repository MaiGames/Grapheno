//const path = require('path')
const fs = require('fs')
const filter = require('pixi.js').Filter


fileStrCache = {}

module.exports.loadFileStr = (path) => {

    fileStrCache[path] = fs.readFileSync(path).toString()

    return fileStrCache[path]

}


module.exports.loadCachedFileStr = (path) => {

    if(fileStrCache[path] == undefined) fileStrCache[path] = fs.readFileSync(path).toString()

    return fileStrCache[path]

}