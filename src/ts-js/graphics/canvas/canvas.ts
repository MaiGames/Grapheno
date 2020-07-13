import { EventEmitter } from 'events'
import { IHash } from '../../util/interfaces'

import tinycolor from 'tinycolor2'

export class Canvas extends EventEmitter {

    params: IHash 
    layers: Layer[]

    pix_app: PIXI.Application
    html_window: Window
     
    constructor(pix_app: PIXI.Application, html_window: Window, params: IHash, layers: Array<Layer> = []) {

        super()

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

    addLayer(layer: Layer, index: number) { }

    moveLayer(layer_name: string, to_index: number) { }

    getLayers(): Array<Layer> | undefined { return undefined }

    getLayer(layer_name: string): Layer | undefined { return undefined }

    getLayerIndex(layer_name: string): number | undefined { return undefined }

    scroll(deltaX: number, deltaY: number) { }

    destroy() { }

}


export class Layer {

    name = "Layer"
    canvas!: Canvas

    constructor(name: string){

        this.name = name
        
    }

}