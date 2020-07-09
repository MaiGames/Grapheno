import Lang from "./util/lang"
import Theme from "./util/theme"

import path from 'path'

export default class GeneralManager {

    lang = new Lang()
    theme = new Theme()

    constructor() {

        this.initManager()

    }
    
    initManager() {

        this.initLang()

        this.initTheme()

    }

    initLang() {

        this.lang.loadLang(path.join(__dirname, "../../assets/lang/en_US.json"), "en_US")
        this.lang.loadLang(path.join(__dirname, "../../assets/lang/fr_FR.json"), "fr_FR")
      
        this.lang.setLang("en_US")
      
    }

    initTheme() {

        this.theme.loadTheme(path.join(__dirname, "../../assets/theme/dark_darcula.json"), "dark_darcula")

        this.theme.setTheme("dark_darcula")
      
    }

    parseLangTheme(element: HTMLElement) { 

        document.body.innerHTML = this.lang.currLangLocalize(document.body.innerHTML)
        
        document.body.innerHTML = this.theme.currThemeParse(document.body.innerHTML)

        for(let [name, value] of Object.entries(this.theme.getCurrTheme())) {  

            if(name.startsWith('--')) {

                var val = null

                if(value.startsWith("$")) 
                    val = value.substr(1)
                else
                    val = this.theme.getCurrThemeColor(name).toHexString()

                document.documentElement.style.setProperty(name, val)

            }

        }

    }

}