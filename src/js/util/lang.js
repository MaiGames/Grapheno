const fs = require('fs')

var loadedLangs = []

var currLangIndex = 0;

var currLangName = "";

function loadLang(json_path, lang_name) {
    
    loadedLangs.push({
        lang: JSON.parse(fs.readFileSync(json_path, 'utf8')),
        lang_name: lang_name
    })

}

function setLang(lang_name) {

    var count = 0

    for(lang of loadedLangs){

        if(lang.lang_name === lang_name) {
            currLangIndex = count
            return
        }

        count++

    }

    throw new Error("Lang not found (maybe not loaded?)")

   //currLangName = lang_name

}
 
function getCurrLang() {

    return loadedLangs[currLangIndex].lang

}

function getCurrLangStr(field) {
    return getCurrLang()[field]
}

function currLangLocalize(toLocalizeStr) {

    for(let [name, value] of Object.entries(getCurrLang())) {
        toLocalizeStr = toLocalizeStr.replace("$" + name, value)
    }
    
    return toLocalizeStr

}

module.exports.loadLang = loadLang
module.exports.setLang = setLang
module.exports.getCurrLang = getCurrLang
module.exports.currLangLocalize = currLangLocalize
module.exports.getCurrLangStr = getCurrLangStr