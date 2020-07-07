/*
* This is the preload script, all the code in here
* will be executed each time before a page finishes loading.
*
* We do important global stuff here, such as localization,
* body injecting (mostly top window bar), theme parsing and
* event declaration.
*/

const {ipcRenderer, remote} = require('electron');
const fs = require('fs')
const path = require('path')
const globalVars = require('./global_variables')

const lang = globalVars.getGlobal("lang") //get lang module
const theme = globalVars.getGlobal("theme") //get theme module

/*
 * Global variables that are the contents of the head and the body that
 * will be injected to all the pages.
 * 
 * They'll only be set once if they aren't defined yet so we don't have
 * to worry about it taking too much time to load everytime a new page loads.
 */
globalVars.setGlobalIfUndefined("_bodies", function() { return fs.readFileSync(path.join(__dirname, '/../html/_bodies.html'), 'utf8') })

const e_window = remote.getCurrentWindow()

var hideMinimizeMaximize = false

/*
* Function to be called when a new page loads
*/
function init() { 

  /*
  * Injection part: We'll simply concatenate the
  * global _bodies content into the current body
  */

  document.body.innerHTML = globalVars.getGlobal("_bodies") + document.body.innerHTML

  /*
  * Localization and theme parts: We'll replace all String parts with an specific format 
  * ($varname for lang, %varname for themes) only inside the body. For themes, we'll 
  * also set the variables specified in the JSON file as CSS variables
  */
  document.body.innerHTML = lang.currLangLocalize(document.body.innerHTML)
 
  document.body.innerHTML = theme.currThemeParse(document.body.innerHTML)

  for(let [name, value] of Object.entries(theme.getCurrTheme())) {  

    if(name.startsWith('--')) {

      var val = null

      if(value.startsWith("$")) 
        val = value.substr(1)
      else
        val = theme.getCurrThemeColor(name).toHexString()

      document.documentElement.style.setProperty(name, val)

    }

  }

  /*
   * firstInit part: We'll determine if this is the first initialization in the whole
   * program, and then emit an event depending on this. 
   */
  globalVars.setGlobalIfUndefined("firstInit", function() { return true })

  if(!globalVars.getGlobal('firstInit')) { //stuff to do when this is not the first init (first page loaded)
  
    //we'll simply emit an event for the current page to decide what to do
    e_window.emit("not-first-init") 

  } else { //stuff to do when this is the first init

    //we'll simply emit an event for the current page to decide what to do
    e_window.emit("first-init") 

    globalVars.setGlobal("firstInit", false) //for next inits checking

  }

  /*
   * Window top-bar part: Registering events, styling, etc. 
   * for the window html top-var 
   */

  e_window.on("resize", function(e) {

    //set html title text to current window title string
    document.getElementById("title").innerHTML = e_window.title

    /*
    * Set maximize btt text depending on 
    * current maximize or fullscreen state
    */
    const maxbtn = document.getElementById("max-btn")
    if (e_window.isMaximized() || e_window.fullScreen) {
      maxbtn.innerHTML = "▾"
    } else {
      maxbtn.innerHTML = "▴"
    }

  }) 

  document.getElementById("min-btn").addEventListener("click", function (e) { //minimize title bar btt

    e_window.minimize(); //simply minimize the window

  });

  document.getElementById("max-btn").addEventListener("click", function (e) { //maximize title bar btt

    //alternating between fullscreen/maximized and minimized state
    if (!e_window.isMaximized() && !e_window.fullScreen) { 
        e_window.maximize();
    } else {
        e_window.unmaximize();
        e_window.fullScreen = false
    }

  });
    
  document.getElementById("close-btn").addEventListener("click", function (e) { //close title bar btt

    //we simply emit an event for the current page to decide what to do
    e_window.emit("close-btt") 

  });

  /*
  * In some places we might need to hide minimize and 
  * maximize btts, so we add an event listener for this.
  */
  e_window.on("hide-minimize-maximize", function() {

    //set btts disabled state to true, since they are still clickable after opacity = 9
    document.getElementById("min-btn").disabled = true 
    document.getElementById("max-btn").disabled = true

    //set btts opacity to 0
    document.getElementById("min-btn").style.opacity = "0"
    document.getElementById("max-btn").style.opacity = "0"

  })
  
  document.addEventListener('dragover', event => event.preventDefault());
  document.addEventListener('drop', event => event.preventDefault());

  e_window.emit("finish-init-preload")

}

//call init function when the dom content is loaded
document.addEventListener('DOMContentLoaded', function() {
  init()
})

/*
* Stuff to be executed as soon as the preload starts
*/

//To hide the min and max btts as soon as posible
e_window.on("queue-hide-minimize-maximize", function() {

  hideMinimizeMaximize = true

})