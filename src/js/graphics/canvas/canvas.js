const EventEmitter = require('events');

module.exports.Canvas = class Canvas extends EventEmitter { 
     
    constructor(pix_app, html_window, params, layers = []) {

        super()

        const tinycolor = require('tinycolor2')

        if(params.sqs_width == null) params.sqs_width = 100
        if(params.sqs_height == null) params.sqs_height = 100

        if(params.rect_width == null) params.rect_width = 400
        if(params.rect_height == null) params.rect_height = 400

        if(params.grid_linecolor == null) params.grid_linecolor = tinycolor("white")
        if(params.grid_border_linecolor == null) params.grid_border_linecolor = tinycolor("white")

        this.params = params
        this.layers = layers

        this.pix_app = pix_app
        this.html_window = html_window

    }

    addLayer(layer, index) { }

    moveLayer(layer_name, to_index) { }

    getLayers() { }

    getLayer(layer_name) { }

    getLayerIndex(layer_name) { }

    scroll(deltaX, deltaY) { }

    destroy() { }

}


module.exports.Layer = class Layer {

    name = "Layer"
    canvas = null

    constructor(name){

        this.name = name
        
    }

}