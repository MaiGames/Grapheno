/*
* This is the preload script, all the code in here
* will be executed each time before a page finishes loading.
*
* We do important global stuff here, such as localization,
* body injecting (mostly top window bar), theme parsing and
* event declaration.
*/

import { remote } from 'electron'
import fs from 'fs'
import path from 'path'
import * as globals from './global'

import GeneralManager from './general_manager'

const e_window = remote.getCurrentWindow()

const manager: GeneralManager = new GeneralManager()

/*
 * Global variables that are the contents of the head and the body that
 * will be injected to all the pages.
 * 
 * They'll only be set once if they aren't defined yet so we don't have
 * to worry about it taking too much time to load everytime a new page loads.
 */
globals.setGlobalIfUndefined("_bodies", function() { return fs.readFileSync(path.join(__dirname, '/../html/_bodies.html'), 'utf8') })

globals.setGlobalIfUndefined("general_manager", function() { return manager })

/*
* Function to be called when the page loads
*/
function init() { 

  /*
  * Injection part: We'll simply concatenate the
  * global _bodies content into the current body
  */
  document.body.innerHTML = globals.getCachedGlobal("_bodies") + document.body.innerHTML

  /*
  * Localization and theme parts: We'll replace all String parts with an specific format 
  * ($varname for lang, %varname for themes) only inside the body. For themes, we'll 
  * also set the variables specified in the JSON file as CSS variables
  */
  
  manager.parseLangTheme(document.body)

  /*
   * firstInit part: We'll determine if this is the first initialization in the whole
   * program, and then emit an event depending on this. 
   */
  globals.setGlobalIfUndefined("firstInit", function() { return true })

  if(!globals.getGlobal('firstInit')) { //stuff to do when this is not the first init (first time loaded)
  
    //we'll simply emit an event for the current page to decide what to do
    manager.eventEmitter.emit("not-first-init") 

  } else { //stuff to do when this is the first init

    //we'll simply emit an event for the current page to decide what to do
    manager.eventEmitter.emit("first-init") 

    globals.setGlobal("firstInit", false) //for next inits checking

  }

  /*
   * Window top-bar part: Registering events, styling, etc. 
   * for the window html top-var 
   */

  const minbtn = <HTMLButtonElement> document.getElementById("min-btn")!
  const maxbtn = <HTMLButtonElement> document.getElementById("max-btn")!

  e_window.on("resize", function() {

    //set html title text to current window title string
    document.getElementById("title")!.innerHTML = e_window.title

    /*
    * Set maximize btt text depending on 
    * current maximize or fullscreen state
    */
    if (e_window.isMaximized() || e_window.fullScreen) {
      maxbtn.innerHTML = "▾"
    } else {
      maxbtn.innerHTML = "▴"
    }

  }) 

  minbtn.addEventListener("click", function (e) { //minimize title bar btt

    e_window.minimize() //simply minimize the window

  });

  maxbtn.addEventListener("click", function (e) { //maximize title bar btt

    //alternating between fullscreen/maximized and minimized state
    if (!e_window.isMaximized() && !e_window.fullScreen) { 
        e_window.maximize()
    } else {
        e_window.unmaximize()
        e_window.fullScreen = false
    }

  });
    
  document.getElementById("close-btn")!.addEventListener("click", function (e) { //close title bar btt

    //we simply emit an event for the current page to decide what to do
    manager.eventEmitter.emit("close-btt") 

  });

  /*
  * In some places we might need to hide minimize and 
  * maximize btts, so we add an event listener for this.
  */
  manager.eventEmitter.on('hide-minimize-maximize', function() {

    //set btts disabled state to true, since they are still clickable after opacity = 9
    minbtn.disabled = true
    maxbtn.disabled = true

    //set btts opacity to 0
    minbtn.style.opacity = "0"
    maxbtn.style.opacity = "0"

  })
  
  document.addEventListener('dragover', event => event.preventDefault());
  document.addEventListener('drop', event => event.preventDefault());

  manager.eventEmitter.emit("finish-init-preload")

}

//call init function when the dom content is loaded
document.addEventListener('DOMContentLoaded', init)
