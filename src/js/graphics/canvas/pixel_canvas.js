const array_util = require('../../util/array_util')
const parent = require('./canvas')

const gh_grid = require('../grid')
const color_util = require('../../util/color_util')

module.exports.PixelCanvas = class PixelCanvas extends parent.Canvas {
    
    intervals = []

    constructor(pix_app, html_window, params, layers = []) {

        super(pix_app, html_window, params, layers)
        
    }

    init() {
        
        this.grid = new gh_grid.Grid({

            vpw: this.html_window.innerWidth,
            vph: this.html_window.innerHeight,
        
            sqs_width: this.params.sqs_width,
            sqs_height: this.params.sqs_height,
            rect_width: this.params.rect_width,
            rect_height: this.params.rect_height,
            border_size: 1,

            border_color: this.params.grid_linecolor,
            line_color: this.params.grid_border_linecolor
        
        })

        this.grid.addResizeEvent(this.html_window)
     
        //center grid in the middle of the screen
        this.grid.setPosition( (this.pix_app.renderer.width / 2) - (this.grid.getRect().width / 2), 
                               (this.pix_app.renderer.height / 2 ) - (this.grid.getRect().height / 2) )

        this.pix_app.stage.addChild(this.grid.getRect())

        this.registerEvents()

    }

    addLayer(layer, index) {

        for(lay in layers) {

            if(lay.name == layer.name) return false

        }

        layer.canvas = this

        this.layers = array_util.displace_insert_at_index(layers, layer, index)

    }

    moveLayer(layer_name, to_index) {

        layIndex = this.getLayerIndex()

        if(layIndex == null) return false

        this.layers = array_util.move_index_to_index(this.layers, layIndex, to_index)

        return true

    }

    getLayers() { return this.layers }

    getLayer(layer_name) {

        for(lay in this.layers) {

            if(lay.name == layer.name) return lay

        }

        return null

    }

    getLayerIndex(layer_name) {

        for(i of this.layers) {

            if(this.layers[i].name == layer.name) return this.layers[i]

        }

        return null

    }

    registerEvents() {
        
        var beforeWidth = this.html_window.innerWidth
        var beforeHeight = this.html_window.innerHeight
        
        const inGrid = this.grid

        this.html_window.addEventListener("resize", () => {
            
            const deltaWidth = (this.html_window.innerWidth - beforeWidth) /2
            const deltaHeight = (this.html_window.innerHeight - beforeHeight) / 2

            inGrid.setPosition(inGrid.getRect().x + deltaWidth, inGrid.getRect().y + deltaHeight)

            beforeWidth = this.html_window.innerWidth
            beforeHeight = this.html_window.innerHeight

        })

    }

    destroy() {



    }

}

module.exports.PixelLayer = class PixelLayer extends parent.Layer {

    constructor(name){

        super(name)

    }

}