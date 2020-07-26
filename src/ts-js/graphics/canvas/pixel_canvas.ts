import * as array_util from '../../util/array_util'
import * as color_util from '../../util/color_util'

import { Grid } from '../grid'

import { Canvas, Layer } from './canvas'
import { IHash } from '../../interfaces'

import { IHandlerChild, HandleCallMode, HandlerParent } from '../../util/handling'

import { KeyboardInput } from '../../input/keyboard_input'
import { ScrollBar } from '../scroll_bar'

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

        for(const lay of this.layers) {
            
            if(lay.name == layer.name) return false

        }

        layer.canvas = this

        this.layers = array_util.displace_insert_at_index(this.layers, layer, index)

    }

    moveLayer(layer_name: string, to_index: number) {

        const layIndex = this.getLayerIndex(layer_name)

        if(layIndex == null) return false

        this.layers = array_util.move_index_to_index(this.layers, layIndex, to_index)

        return true

    }

    getLayers(): Array<Layer> | undefined { return this.layers }

    getLayer(layer_name: String): Layer | undefined {

        for(const lay of this.layers) {

            if(lay.name == layer_name) return lay

        }

        return undefined

    }

    getLayerIndex(layer_name: String): number | undefined {

        var count = 0

        for(const i in this.layers) {

            if(this.layers[i].name == layer_name) return count

            count++

        }

        return undefined

    }

    private registerHandlers() {
        
        this.addHandlerChild("ResizeHandler", new ResizeHandler(this.html_window, this.grid))
        this.addHandlerChild("ScrollHandler", new ScrollHandler(this.grid, this.pixi_app))
        this.addHandlerChild("ScrollBarHandler", new ScrollBarHandler(this.pixi_app))

        this.addHandleDefaults()

    }

    private addHandleDefaults() {

        this.html_window.addEventListener("resize", () => { this.handleSingle("ResizeHandler", {}) })

        document.getElementsByTagName("canvas")[0].addEventListener("wheel", (event) => {

            this.handleSingle("ScrollHandler", { 
                deltaX: event.deltaX,
                deltaY: event.deltaY,
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

class ScrollHandler implements IHandlerChild {

    grid: Grid
    pixi_app: PIXI.Application

    scrollX: number = 0
    scrollY: number = 0
    
    resize_handler: ResizeHandler

    parent: HandlerParent
   
    constructor(grid: Grid, pixi_app: PIXI.Application) {

        this.grid = grid
        this.pixi_app = pixi_app

        this.scrollX = (this.pixi_app.renderer.width / 2) - (this.grid.getRect().width / 2) 
        this.scrollY = (this.pixi_app.renderer.height / 2 ) - (this.grid.getRect().height / 2)

    }

    init() {

        this.resize_handler = <ResizeHandler> <unknown> this.parent.getHandlerChild("ResizeHandler")

    }

    handle(params: IHash, mode: HandleCallMode): any {

        const delta_x: number = params['deltaX']
        const delta_y: number = params['deltaY']

        if(params['invert'])
            this.setScrollCoords(this.scrollX + delta_y, this.scrollY + delta_x)        
        else
            this.setScrollCoords(this.scrollX + delta_x, this.scrollY + delta_y) 

    }

    setScrollCoords(scroll_x: number, scroll_y: number) {

        this.scrollX = scroll_x
        this.scrollY = scroll_y

        this.grid.setPosition(this.scrollX, this.scrollY)

    }

}

class ScrollBarHandler implements IHandlerChild {

    pixi_app: PIXI.Application
    parent: HandlerParent

    scroll_bar: ScrollBar

    constructor(pixi_app: PIXI.Application) {

        this.pixi_app = pixi_app

        this.scroll_bar = new ScrollBar({}, pixi_app)
    
    }

    init() {

    }

    handle(params: IHash, mode: HandleCallMode) {

    }

}

class ResizeHandler implements IHandlerChild {

    grid: Grid
    html_window: Window

    before_width: number
    before_height: number

    parent: HandlerParent
    
    constructor(html_window: Window, grid: Grid) {

        this.html_window = html_window

        this.grid = grid

    }

    init() {
        
        this.before_width = this.html_window.innerWidth
        this.before_height = this.html_window.innerHeight

    }

    handle(params: IHash, mode: HandleCallMode): any {

        if(mode == HandleCallMode.AllHandlerCall) return

        const delta_width = (this.html_window.innerWidth - this.before_width) / 2
        const delta_height = (this.html_window.innerHeight - this.before_height) / 2

        const scroll_handler = <ScrollHandler> <unknown> this.parent.getHandlerChild("ScrollHandler")
        scroll_handler.setScrollCoords(scroll_handler.scrollX + delta_width, scroll_handler.scrollY + delta_height)

        this.before_width = this.html_window.innerWidth
        this.before_height = this.html_window.innerHeight

    }

}