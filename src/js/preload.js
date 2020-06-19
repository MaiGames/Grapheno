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
const globalVars = require('./util/across_global_variables')

const lang = globalVars.getGlobal("lang") //get lang module
const theme = globalVars.getGlobal("theme") //get theme module

/*
 * Global variables that are the contents of the head and the body that
 * will be injected to all the pages.
 * 
 * They'll only be set once if they aren't defined yet so we don't have
 * to worry about it taking too much time to load everytime a new page loads.
 */
globalVars.setGlobalIfUndefined("_bodies", fs.readFileSync(path.join(__dirname, '../html/_bodies.html'), 'utf8'))
globalVars.setGlobalIfUndefined("_heads", fs.readFileSync(path.join(__dirname, '../html/_heads.html'), 'utf8'))

const window = remote.getCurrentWindow()

var hideMinimizeMaximize = false

/*
* Function to be called when a new page loads
*/
function init() { 

  /*
  * Injection part: We'll simply concatenate the global _bodies and _head content
  * into the current body and head respectively
  */

  // Comment reason: Insecure and useless right now
  //document.head.innerHTML = globalVars.getGlobal("_heads") + document.head.innerHTML 

  document.body.innerHTML = globalVars.getGlobal("_bodies") + document.body.innerHTML

  /*
  * Localization and theme parts: We'll replace all String parts with an specific format 
  * ($varname for lang, %varname for themes) only inside the body. For themes, we'll 
  * also set the variables specified in the JSON file as CSS variables
  */
  document.body.innerHTML = lang.currLangLocalize(document.body.innerHTML)
 
  document.body.innerHTML = theme.currThemeParse(document.body.innerHTML)

  for(let [name, value] of Object.entries(theme.getCurrTheme())) {  
    document.documentElement.style.setProperty(name, value)
  }

  /*
   * firstInit part: We'll determine if this is the first initialization in the whole
   * program, and then emit an event depending on this. 
   */
  globalVars.setGlobalIfUndefined("firstInit", true)

  if(!globalVars.getGlobal('firstInit')) { //stuff to do when this is not the first init (first page loaded)
  
    //we'll simply emit an event for the current page to decide what to do
    window.emit("not-first-init") 

  } else { //stuff to do when this is the first init

    //we'll simply emit an event for the current page to decide what to do
    window.emit("first-init") 

    globalVars.setGlobal("firstInit", false) //for next inits checking

  }

  /*
   * Window top-bar part: Registering events, styling, etc. 
   * for the window html top-var 
   */

  /* 
  * To hide the minimize and maximize buttons as soon as possible and
  * avoid weird flashes 
  */
  if(hideMinimizeMaximize) {
      //set btts disabled state to true, since they are still clickable after opacity = 9
      document.querySelector("#min-btn").disabled = true 
      document.querySelector("#max-btn").disabled = true
  
      //set btts opacity to 0
      document.querySelector("#min-btn").style.opacity = "0"
      document.querySelector("#max-btn").style.opacity = "0"
  }

  setInterval(function(){ //declare interval for changing maximize button & title texts

    //set html title text to actual window title string
    document.querySelector("#title").innerHTML = window.title

    /*
    * Set maximize btt text depending on 
    * current maximize or fullscreen state
    */
    const maxbtn = document.querySelector("#max-btn")
    if (window.isMaximized() || window.fullScreen) {
      maxbtn.innerHTML = "▾"
    } else {
      maxbtn.innerHTML = "▴"
    }

  }, 50)


  document.querySelector("#min-btn").addEventListener("click", function (e) { //minimize title bar btt

    window.minimize(); //simply minimize the window

  });

  document.querySelector("#max-btn").addEventListener("click", function (e) { //maximize title bar btt

    //alternating between fullscreen/maximized and minimized state
    if (!window.isMaximized() && !window.fullScreen) { 
        window.maximize();
    } else {
        window.unmaximize();
        window.fullScreen = false
    }

  });
    
  document.querySelector("#close-btn").addEventListener("click", function (e) { //close title bar btt

    //we simply emit an event for the current page to decide what to do
    window.emit("close-btt") 

  });

  /*
  * In some places we might need to hide minimize and 
  * maximize btts, so we add an event listener for this.
  */
  window.on("hide-minimize-maximize", function() {

    //set btts disabled state to true, since they are still clickable after opacity = 9
    document.querySelector("#min-btn").disabled = true 
    document.querySelector("#max-btn").disabled = true

    //set btts opacity to 0
    document.querySelector("#min-btn").style.opacity = "0"
    document.querySelector("#max-btn").style.opacity = "0"

  })
  
  document.addEventListener('dragover', event => event.preventDefault());
  document.addEventListener('drop', event => event.preventDefault());

  window.emit("finish-init-preload")

}

//call init function when the dom content is loaded
document.addEventListener('DOMContentLoaded', function() {
  init()
})

/*
* Stuff to be executed as soon as the preload starts
*/

//To hide the min and max btts as soon as posible
window.on("queue-hide-minimize-maximize", function() {

  hideMinimizeMaximize = true

})
