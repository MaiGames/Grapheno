import { EventEmitter } from 'events'
import { IHash } from '../../interfaces'

import tinycolor from 'tinycolor2'
import { HandlerParent } from '../../util/handling'

export class Canvas extends HandlerParent {

    emitter = new EventEmitter()

    params: IHash 
    layers: Layer[]

    pixi_app: PIXI.Application
    html_window: Window
     
    constructor(pixi_app: PIXI.Application, html_window: Window, params: IHash, layers: Array<Layer> = []) {

        super()

        if(params.sqs_width == null) params.sqs_width = 100
        if(params.sqs_height == null) params.sqs_height = 100

        if(params.rect_width == null) params.rect_width = 400
        if(params.rect_height == null) params.rect_height = 400

        if(params.grid_linecolor == null) params.grid_linecolor = tinycolor("white")
        if(params.grid_border_linecolor == null) params.grid_border_linecolor = tinycolor("white")

        this.params = params
        this.layers = layers

        this.pixi_app = pixi_app
        this.html_window = html_window

    }

    addLayer(layer: Layer, index: number) { }

    moveLayer(layer_name: string, to_index: number) { }

    getLayers(): Array<Layer> | undefined { return undefined }

    getLayer(layer_name: string): Layer | undefined { return undefined }

    getLayerIndex(layer_name: string): number | undefined { return undefined }

    destroy() { }

}


export class Layer {

    name = "Layer"
    canvas!: Canvas

    constructor(name: string){

        this.name = name
        
    }

}