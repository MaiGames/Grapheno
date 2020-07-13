import * as array_util from '../../util/array_util'
import * as color_util from '../../util/color_util'

import { Grid } from '../grid'

import { Canvas, Layer } from './canvas'
import { IHash } from '../../util/interfaces'

export default class PixelCanvas extends Canvas {
    
    grid!: Grid

    constructor(pix_app: PIXI.Application, html_window: Window, params: IHash, layers: Array<PixelLayer> = []) {

        super(pix_app, html_window, params, layers)
        
        this.init()

    }

    init() {
        
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
     
        //center grid in the middle of the screen
        this.grid.setPosition( (this.pix_app.renderer.width / 2) - (this.grid.getRect().width / 2), 
                               (this.pix_app.renderer.height / 2 ) - (this.grid.getRect().height / 2) )

        this.pix_app.stage.addChild(this.grid.getRect())

        this.registerEvents()

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

export class PixelLayer extends Layer {

    constructor(name: string){

        super(name)

    }

}