import { IHandlerChild, HandlerParent, HandleCallMode } from "../../../util/handling"
import { Grid } from "../../grid"
import { IHash } from "../../../interfaces"
import { ScrollBar, ScrollBarOrientation } from "../../scroll_bar"

import { EventEmitter } from "events"

import * as globals from "../../../global"
import GeneralManager from "../../../general_manager"
import Victor from "victor"

export class ScrollHandler implements IHandlerChild {

    grid: Grid
    pixi_app: PIXI.Application

    scroll_x: number = 0
    scroll_y: number = 0
    
    resize_handler: ResizeHandler

    x_scroll_bar: ScrollBar
    y_scroll_bar: ScrollBar

    general_manager: GeneralManager

    parent: HandlerParent

    constructor(grid: Grid, pixi_app: PIXI.Application) {

        this.grid = grid
        this.pixi_app = pixi_app

        this.scroll_x = (this.pixi_app.renderer.width / 2) - (this.grid.getRect().width / 2) 
        this.scroll_y = (this.pixi_app.renderer.height / 2) - (this.grid.getRect().height / 2)

    }

    init() {

        this.general_manager = globals.getCachedGlobal("general_manager")

        this.x_scroll_bar = new ScrollBar({

            orientation: ScrollBarOrientation.Horizontal,

            bar_x: 0,
            bar_y: this.pixi_app.stage.height,

            bar_h: this.pixi_app.stage.width,

            full_bar_color: this.general_manager.theme.getCurrThemeColor("scroll_full_bar"),
            inner_bar_color: this.general_manager.theme.getCurrThemeColor("scroll_inner_bar"),

        }, this.pixi_app)

        this.resize_handler = <ResizeHandler> <unknown> this.parent.getHandlerChild("Resize")

        this.resize_handler.on("resize", (delta_width, delta_height) => {

            let size = this.x_scroll_bar.getScrollBarSize()
            let position = this.x_scroll_bar.getScrollBarPosition()

            this.x_scroll_bar.setScrollBarPosition(new Victor(position.x, position.y + delta_height))
            //this.x_scroll_bar.setScrollBarSize(new Victor(size.x, size.y + delta_width))

            console.log(this.x_scroll_bar.getScrollBarPosition())
            console.log(this.x_scroll_bar.getScrollBarSize())

        })

    }

    handle(params: IHash, mode: HandleCallMode): any {

        if(params['delta_x'] == null) return
        if(params['delta_y'] == null) return

        let delta_x: number = params['delta_x']
        let delta_y: number = params['delta_y']

        if(params['invert'])
            this.setScrollCoords(this.scroll_x + delta_y, this.scroll_y + delta_x)        
        else
            this.setScrollCoords(this.scroll_x + delta_x, this.scroll_y + delta_y) 

    }

    setScrollCoords(scroll_x: number, scroll_y: number) {

        this.scroll_x = scroll_x
        this.scroll_y = scroll_y

        this.grid.setPosition(this.scroll_x, this.scroll_y)

    }

}

export class ResizeHandler extends EventEmitter implements IHandlerChild {

    grid: Grid
    pixi_app: PIXI.Application

    before_width: number
    before_height: number

    parent: HandlerParent
    
    constructor(pixi_app: PIXI.Application, grid: Grid) {

        super()

        this.pixi_app = pixi_app
        this.grid = grid

    }

    init() {
        
        this.before_width = this.pixi_app.renderer.width
        this.before_height = this.pixi_app.renderer.height

    }

    handle(params: IHash, mode: HandleCallMode): any {

        if(mode == HandleCallMode.AllHandlerCall) return

        let scroll_handler = <ScrollHandler> <unknown> this.parent.getHandlerChild("Scroll")

        let delta_width = (this.pixi_app.renderer.width - this.before_width) / 2
        let delta_height = (this.pixi_app.renderer.height - this.before_height) / 2

        scroll_handler.setScrollCoords(scroll_handler.scroll_x + delta_width, scroll_handler.scroll_y + delta_height)

        this.emit("resize", delta_width, delta_height)

        this.before_width = this.pixi_app.renderer.width
        this.before_height = this.pixi_app.renderer.height

    }

}

export class ZoomHandler implements IHandlerChild {

    zoom_percent = 1

    parent: HandlerParent

    init() {

    }

    handle(params: IHash, mode: HandleCallMode) {

    }

}