const {ipcRenderer, remote} = require('electron');
const fs = require('fs')
const path = require('path')
const globalVars = require('./util/across_global_variables')

const lang = globalVars.getGlobal("lang")

globalVars.setGlobalIfUndefined("_bodies", fs.readFileSync(path.join(__dirname, '../html/_bodies.html'), 'utf8'))
globalVars.setGlobalIfUndefined("_heads", fs.readFileSync(path.join(__dirname, '../html/_heads.html'), 'utf8'))

/*
* Function to be called everytime a new page loads
*/
function init() { 

  document.head.innerHTML = globalVars.getGlobal("_heads") + document.head.innerHTML
  document.body.innerHTML = globalVars.getGlobal("_bodies") + document.body.innerHTML

  document.body.innerHTML = lang.currLangLocalize(document.body.innerHTML) //localize the document body with the current lang
 
  globalVars.setGlobalIfUndefined("firstInit", true)

  if(!globalVars.getGlobal('firstInit')) { //stuff to do when this is not the first init (first page loaded)
  
  } else { //stuff to do when this is the first init

    remote.getCurrentWindow().emit("first-init")

    globalVars.setGlobal("firstInit", false) //for next inits checking

  }

  setInterval(function(){ //declare interval for changing maximize button & title texts

    const title = remote.getCurrentWindow().title
    document.querySelector("#title").innerHTML = title

    const window = remote.getCurrentWindow()
    const maxbtn = document.querySelector("#max-btn")

    if (window.isMaximized() || window.fullScreen) {
      maxbtn.innerHTML = "▾"
    } else {
      maxbtn.innerHTML = "▴"
    }

  }, 50)


  document.querySelector("#min-btn").addEventListener("click", function (e) { //minimize title bar btt
    const window = remote.getCurrentWindow();
    window.minimize(); 
  });
     
  document.querySelector("#max-btn").addEventListener("click", function (e) { //maximize title bar btt
    const window = remote.getCurrentWindow();
    const maxbtn = document.querySelector("#max-btn") 
    
    if (!window.isMaximized() && !window.fullScreen) { //alternate between fullscreen/maximized and minimized state
        window.maximize();
    } else {
        window.unmaximize();
        window.fullScreen = false
    }

  });
    
  document.querySelector("#close-btn").addEventListener("click", function (e) { //close title bar btt
    const window = remote.getCurrentWindow();
    window.close();
  });

  remote.getCurrentWindow().emit("finish-init-preload")

}
  
document.addEventListener('DOMContentLoaded', function() {
  //if (document.readyState == "complete") 
  init();
})