var beforeY = 0
var startY = 0
var y = 0

var firstSet = true

var mouseIsClicking = false

insideResizeDiv = false

remote.getCurrentWindow().on("finish-init-preload", (event) => {

    document.querySelector("#min-btn").disabled = true
    document.querySelector("#max-btn").disabled = true

    document.querySelector("#min-btn").style.opacity = "0"
    document.querySelector("#max-btn").style.opacity = "0"

    document.querySelector("#resize-bar").addEventListener("mouseenter", function() {

        insideResizeDiv = true
        firstSet = true   

    })
    
    document.querySelector("#resize-bar").addEventListener("mouseout", function() {
        
        insideResizeDiv = false
        beforeY = 0
        
        firstSet = false
    
    })

    
    const toResizeElem = document.querySelector("#left-bottom-bar")

    toResizeElem.style.height = "240px"

    resizeLineElem = document.querySelector("#resize-bar")

    resizeLineElem.style.bottom = "256px"

    resizeLineElem.addEventListener("mousedown", function() {

        window.addEventListener("mousemove", resize)
        window.addEventListener("mouseup", stopResize)

    })

    function resize(e) {  

        var currY = y - toResizeElem.getBoundingClientRect().top;

        var height = parseInt(toResizeElem.style.height.replace("px", ""))

        if(height > 377) {

            toResizeElem.style.height = 377 + "px"
            resizeLineElem.style.bottom = (377 + 16) + "px" 
            
            stopResize()
            return   

        } else if(height < 160) {

            toResizeElem.style.height = 160 + "px"
            resizeLineElem.style.bottom = (160 + 16) + "px"    
            
            stopResize()
            return

        }


        height -= currY

        toResizeElem.style.height = height + "px"
        resizeLineElem.style.bottom = (height + 16) + "px"

        beforeY = currY;

    }

    function stopResize() {
        window.removeEventListener("mousemove", resize)
        window.removeEventListener("mouseup", stopResize)
    }

    document.body.onload = function() {
        remote.getCurrentWindow().show()
    }

    document.body.onmousemove = function(event){
        y = event.pageY
        if(firstSet) {
            firstSet = false
            startY = y
        }
    }
        
})

remote.getCurrentWindow().on("close-btt", (evt) => {

    remote.getCurrentWindow().hide()

})
