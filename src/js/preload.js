const {ipcRenderer, remote} = require('electron');
const fs = require('fs')
const path = require('path')

var _bodies = fs.readFileSync(path.join(__dirname, '../html/_bodies.html'), 'utf8');
var _heads = fs.readFileSync(path.join(__dirname, '../html/_heads.html'), 'utf8');

function init() { 

  document.head.innerHTML = _heads + document.head.innerHTML
  document.body.innerHTML = _bodies + document.body.innerHTML

  console.log(remote.getGlobal('firstInit'))

  if(!remote.getGlobal('firstInit')) { //stuff to do when this is not the first init (first page loaded)
    
    fadeInPage()

  } else { //stuff to do when this is the first init

    document.getElementById('fader').style.opacity = "0.0"

    ipcRenderer.send("setGlobalVar", "firstInit", false) //for next inits checking

  }

  setInterval(function(){
    const title = remote.getCurrentWindow().title
    document.getElementById("title").innerHTML = title
  }, 50)

  setInterval(function(){
    const window = remote.getCurrentWindow();
    const maxbtn = document.getElementById("max-btn")
    if (window.isMaximized()) {
      maxbtn.innerHTML = "▾"
    } else {
      maxbtn.innerHTML = "▴"
    }
  }, 50)


  document.getElementById("min-btn").addEventListener("click", function (e) {
    const window = remote.getCurrentWindow();
    window.minimize(); 
  });
     
  document.getElementById("max-btn").addEventListener("click", function (e) {
    const window = remote.getCurrentWindow();
    const maxbtn = document.getElementById("max-btn") 
    if (!window.isMaximized()) {
        window.maximize();
        maxbtn.innerHTML = "-"
    } else {
        window.unmaximize();
        maxbtn.innerHTML = "+"
    }	 
  });
    
  document.getElementById("close-btn").addEventListener("click", function (e) {
    const window = remote.getCurrentWindow();
    window.close();
  });

  document.addEventListener('DOMContentLoaded', function() {
    if (!window.AnimationEvent) { return; }
    var anchors = document.getElementsByTagName('a');
    
    for (var idx=0; idx<anchors.length; idx+=1) {
      if (anchors[idx].hostname !== window.location.hostname ||
        anchors[idx].pathname === window.location.pathname) {
        continue;
      }

      anchors[idx].addEventListener('click', function(event) {
        var fader = document.getElementById('fader'),
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
    var fader = document.getElementById('fader');
    fader.classList.remove('fade-in');
  });

}
  
document.onreadystatechange = function () {
  if (document.readyState == "complete") init();
}

//fade
function fadeInPage() {
  if (!window.AnimationEvent) { return; }
  
  var fader = document.getElementById('fader');
  fader.classList.add('fade-out');
}