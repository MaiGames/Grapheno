import { IHash } from "../interfaces";

import * as fs from 'fs'
import tinycolor from 'tinycolor2';

export default class Theme {

    loaded_themes: Array<{theme: IHash, theme_name: string}> = []

    curr_theme_i = 0;

    public loadTheme(json_path: string, theme_name: string) {
        
        this.loaded_themes.push({
            theme: JSON.parse(fs.readFileSync(json_path, 'utf8')),
            theme_name: theme_name
        })

    }

    public setTheme(theme_name: string) {

        var count = 0

        for(const theme of this.loaded_themes){

            if(theme.theme_name === theme_name) {
                this.curr_theme_i = count
                return
            }

            count++

        }

        throw new Error("Theme not found (maybe not loaded?)")

    }

    public getCurrTheme() {

        return this.loaded_themes[this.curr_theme_i].theme

    }

    public getCurrThemeStr(field: string) {
        return this.getCurrTheme()[field]
    }

    public getCurrThemeColor(field: string) {
        return tinycolor(this.getCurrThemeStr(field))
    }

    public currThemeParse(toParseStr: string) {

        for(let [name, value] of Object.entries(this.getCurrTheme())) {
            toParseStr = toParseStr.replace("%" + name, value)
        }
        
        return toParseStr

    }

}