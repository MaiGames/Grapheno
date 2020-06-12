remote.getCurrentWindow().on("first-init", (evt) => {

    ipcRenderer.send("open-starthub")

})