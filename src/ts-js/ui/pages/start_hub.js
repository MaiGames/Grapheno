var beforeY = 0
var startY = 0
var y = 0

var firstSet = true

var mouseIsClicking = false

insideResizeDiv = false
/*
 * When the preload init is finished (localization, global body injected, etc)
 * we'll execute most of the code needed for this page because we need all the 
 * elements to be properly loaded.
 */
remote.getCurrentWindow().on("finish-init-preload", (event) => {

    /*
    * Queue to hide the resize and maximize window
    * buttons as soon as the preload starts, since we
    * don't want the window to be neither maximized nor minimized, 
    */
    remote.getCurrentWindow().emit("hide-minimize-maximize")

    const toResizeElem = document.getElementById("left-bottom-bar")

    toResizeElem.style.height = "240px"

    const resizeLineElem = document.getElementById("resize-bar")

    resizeLineElem.style.bottom = "254.5px"

    resizeLineElem.addEventListener("mousedown", function() {

        window.addEventListener("mousemove", resize)
        window.addEventListener("mouseup", stopResize)

    })

    function resize(e) {  

        var currY = y - toResizeElem.getBoundingClientRect().top;

        var height = parseInt(toResizeElem.style.height.replace("px", ""))

        if(height > 377) {

            toResizeElem.style.height = 377 + "px"
            resizeLineElem.style.bottom = (377 + 14.5) + "px" 
            
            stopResize()
            return   

        } else if(height < 160) {

            toResizeElem.style.height = 160 + "px"
            resizeLineElem.style.bottom = (160 + 14.5) + "px"    
            
            stopResize()
            return
        }

        height -= currY

        toResizeElem.style.height = height + "px"
        resizeLineElem.style.bottom = (height + 14.5) + "px"

        beforeY = currY;

    }

    function stopResize() {
        window.removeEventListener("mousemove", resize)
        window.removeEventListener("mouseup", stopResize)
    }

    document.body.onload = function() { //show window until everything's loaded to avoid weird flashes
        remote.getCurrentWindow().show()
    }

    document.body.onmousemove = function(event){
        y = event.pageY
    }
        
})

/*
* Instead of destroying the window when the user clicks X,
* we'll just hide it to be able to open it again without 
* having to load everything again, to save time.
*/
remote.getCurrentWindow().on("close-btt", (evt) => {

    remote.getCurrentWindow().hide()

})