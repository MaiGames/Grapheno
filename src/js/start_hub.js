remote.getCurrentWindow().on("finish-init-preload", (event) => {

    document.querySelector("#min-btn").disabled = true
    document.querySelector("#max-btn").disabled = true

    document.querySelector("#min-btn").style.opacity = "0"
    document.querySelector("#max-btn").style.opacity = "0"

    document.body.onload = function() {
        remote.getCurrentWindow().show()
    }

})

remote.getCurrentWindow().on("close-btt", (evt) => {

    remote.getCurrentWindow().hide()

})

//remote.getCurrentWindow().setTitle(lang.getCurrLang().title_mainhub)