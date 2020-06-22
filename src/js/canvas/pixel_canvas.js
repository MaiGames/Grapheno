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



    }

}

class Layer {

    name = "Layer"

    constructor(name){

    }

}