const array_util = require('../../util/array_util')

class PixelCanvas {

    width = 0
    height = 0

    layers = []

    constructor(width, height, layers = []) {

        this.width = width
        this.height = height
        this.layers = layers

    }

    addLayer(layer, index) {

        for(lay in layers) {

            if(lay.name == layer.name) return false

        }

        this.layers.canvas = this

        layers = array_util.displace_insert_at_index(layers, layer, index)

    }

    moveLayer(layer_name, to_index) {

        for(i of layers) {

            if(layers[i].name == layer_name) {

                layers = array_util.move_index_to_index(layers, i, to_index)
                return true

            }

        }

        return false

    }

    getLayers() { return this.layers }

    getLayer(layer_name) {

        for(lay in layers) {

            if(lay.name == layer.name) return lay

        }

        return null

    }

}

class Layer {

    name = "Layer"
    canvas = null

    constructor(name){

        this.name = name
        this.canvas = canvas

    }

}