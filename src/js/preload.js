const {ipcRenderer, remote} = require('electron');
const fs = require('fs')
const path = require('path')
const globalVars = require('./util/across_global_variables')

globalVars.setGlobalIfUndefined("_bodies", fs.readFileSync(path.join(__dirname, '../html/_bodies.html'), 'utf8'))
globalVars.setGlobalIfUndefined("_heads", fs.readFileSync(path.join(__dirname, '../html/_heads.html'), 'utf8'))

/*
* Function to be called everytime a new page loads
*/
function init() { 

  while(document.head === null);
  document.head.innerHTML = globalVars.getGlobal("_heads") + document.head.innerHTML
  while(document.body === null);
  document.body.innerHTML = globalVars.getGlobal("_bodies") + document.body.innerHTML

  globalVars.setGlobalIfUndefined("firstInit", true)

  if(!globalVars.getGlobal('firstInit')) { //stuff to do when this is not the first init (first page loaded)
    
    fadeInPage()

  } else { //stuff to do when this is the first init

    document.querySelector('#fader').style.opacity = "0.0"

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

  //fade out code begin

  document.addEventListener('DOMContentLoaded', function() {
    if (!window.AnimationEvent) { return; }
    var anchors = document.getElementsByTagName('a');
    
    for (var idx=0; idx<anchors.length; idx+=1) {
      if (anchors[idx].hostname !== window.location.hostname ||
        anchors[idx].pathname === window.location.pathname) {
        continue;
      }

      anchors[idx].addEventListener('click', function(event) {
        var fader = document.querySelector('#fader'),
            anchor = event.currentTarget;
        
        var listener = function() {
            window.location = anchor.href;
            fader.removeEventListener('animationend', listener);
        };
        fader.addEventListener('animationend', listener);
        
        event.preventDefault();
        fader.classList.add('fade-in');
      });
    }

  });

  window.addEventListener('pageshow', function (event) {
    if (!event.persisted) {
      return;
    }
    var fader = document.querySelector('#fader');
    fader.classList.remove('fade-in');
  });

  //fade out code end

}
  
document.addEventListener('DOMContentLoaded', function() {
  //if (document.readyState == "complete") 
  init();
})

//fading
function fadeInPage() {
  if (!window.AnimationEvent) { return; }
  
  var fader = document.querySelector('#fader');
  fader.classList.add('fade-out');
}