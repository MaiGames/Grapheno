remote.getCurrentWindow().on("finish-init-preload", (event) => {

    document.querySelector("#min-btn").disabled = true
    document.querySelector("#max-btn").disabled = true

    document.querySelector("#min-btn").style.opacity = "0"
    document.querySelector("#max-btn").style.opacity = "0"

})