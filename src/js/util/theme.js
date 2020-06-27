const fs = require('fs')
const tc = require('tinycolor2')

var loadedThemes = []

var currThemeIndex = 0;

function loadTheme(json_path, theme_name) {
    
    loadedThemes.push({
        theme: JSON.parse(fs.readFileSync(json_path, 'utf8')),
        theme_name: theme_name
    })

}

function setTheme(theme_name) {

    var count = 0

    for(theme of loadedThemes){

        if(theme.theme_name === theme_name) {
            currThemeIndex = count
            return
        }

        count++

    }

    throw new Error("Theme not found (maybe not loaded?)")

}

function getCurrTheme() {

    return loadedThemes[currThemeIndex].theme

}

function getCurrThemeStr(field) {
    return getCurrTheme()[field]
}

function getCurrThemeColor(field) {
    return tc.tinycolor(getCurrThemeStr(field))
}

function currThemeParse(toParseStr) {

    for(let [name, value] of Object.entries(getCurrTheme())) {
        toParseStr = toParseStr.replace("%" + name, value)
    }
    
    return toParseStr

}

module.exports.loadTheme = loadTheme
module.exports.setTheme = setTheme
module.exports.getCurrTheme = getCurrTheme
module.exports.currThemeParse = currThemeParse
module.exports.getCurrThemeColor = getCurrThemeColor
module.exports.getCurrThemeStr = getCurrThemeColor