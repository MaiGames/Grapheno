import * as array_util from '../../../util/array_util'
import * as color_util from '../../../util/color_util'

import { Grid } from '../../grid'

import { Canvas, Layer } from '../canvas'
import { IHash } from '../../../interfaces'

import { IHandlerChild, HandleCallMode, HandlerParent } from '../../../util/handling'

import { KeyboardInput } from '../../../input/keyboard_input'
import { ScrollBar } from '../../scroll_bar'
import { ResizeHandler, ScrollHandler, ZoomHandler } from './pixel_handlers'

export default class PixelCanvas extends Canvas {
    
    grid!: Grid

    key_input = new KeyboardInput(document.body)

    constructor(pixi_app: PIXI.Application, html_window: Window, params: IHash, layers: Array<PixelLayer> = []) {

        super(pixi_app, html_window, params, layers)
        
        this.init()

    }

    private init() {

        this.grid = new Grid({

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
     
        this.pixi_app.stage.addChild(this.grid.getRect())

        this.registerHandlers()

    }

    addLayer(layer: Layer, index: number) {

        for(let lay of this.layers) {
            
            if(lay.name == layer.name) return false

        }

        layer.canvas = this

        this.layers = array_util.displace_insert_at_index(this.layers, layer, index)

    }

    moveLayer(layer_name: string, to_index: number) {

        let layIndex = this.getLayerIndex(layer_name)

        if(layIndex == null) return false

        this.layers = array_util.move_index_to_index(this.layers, layIndex, to_index)

        return true

    }

    getLayers(): Array<Layer> | undefined { return this.layers }

    getLayer(layer_name: String): Layer | undefined {

        for(let lay of this.layers) {

            if(lay.name == layer_name) return lay

        }

        return undefined

    }

    getLayerIndex(layer_name: String): number | undefined {

        let count = 0

        for(let i in this.layers) {

            if(this.layers[i].name == layer_name) return count

            count++

        }

        return undefined

    }

    private registerHandlers() {
        
        this.addHandlerChild("Resize", new ResizeHandler(this.pixi_app, this.grid))
        this.addHandlerChild("Scroll", new ScrollHandler(this.grid, this.pixi_app))
        this.addHandlerChild("Zoom", new ZoomHandler())

        this.addHandleDefaults()

    }

    private addHandleDefaults() {

        this.pixi_app.renderer.on("resize", () => { this.handleSingle("Resize", {}) })

        document.getElementsByTagName("canvas")[0].addEventListener("wheel", (event) => {

            this.handleSingle("Scroll", { 
                delta_x: event.deltaX,
                delta_y: event.deltaY,
                invert: this.key_input.isKeyCodeDown(16) //if shift is down, switch/invert x and y delta
            })

        })

    }

    destroy() {

    }

}

export class PixelLayer extends Layer {

    constructor(name: string){

        super(name)

    }

}