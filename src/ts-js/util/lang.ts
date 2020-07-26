import * as fs from 'fs'
import { IHash } from "../interfaces";

export default class Lang {

    loaded_langs: Array< {lang: IHash, lang_name: string} > = []

    curr_lang_i = 0;

    curr_lang_name = "";

    loadLang(json_path: string, lang_name: string) {
        
        this.loaded_langs.push({
            lang: JSON.parse(fs.readFileSync(json_path, 'utf8')),
            lang_name: lang_name
        })

    }

    setLang(lang_name: string) {

        var count = 0

        for(const lang of this.loaded_langs){

            if(lang.lang_name === lang_name) {
                this.curr_lang_i = count
                return
            }

            count++

        }

        throw new Error("Lang not found (maybe not loaded?)")

    }
    
    getCurrLang() {

        return this.loaded_langs[this.curr_lang_i].lang

    }

    getCurrLangStr(field: string) {

        return this.getCurrLang()[field]

    }

    currLangLocalize(toLocalizeStr: string) {

        for(let [name, value] of Object.entries(this.getCurrLang())) {
            toLocalizeStr = toLocalizeStr.replace("$" + name, value)
        }
        
        return toLocalizeStr

    }

}