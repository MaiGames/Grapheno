import { IHash } from "../interfaces"
import tinycolor from "tinycolor2"

import Victor from "victor"

import * as PIXI from "pixi.js"
import { Color } from "../util/color_util"

import { get_tint_filter } from "./tint"

export enum ScrollBarOrientation { Vertical, Horizontal }

export class ScrollBar {

    params: IHash

    orientation = ScrollBarOrientation.Horizontal

    pixi_app: PIXI.Application

    full_bar = PIXI.Sprite.from(PIXI.Texture.WHITE)
    inner_bar = PIXI.Sprite.from(PIXI.Texture.WHITE)

    scroll_position_percent = 0

    scroll_size_percent = 0

    constructor(params: IHash, pixi_app: PIXI.Application) {

        if(params.orientation == null) params.orientation = ScrollBarOrientation.Vertical

        if(params.bar_w == null) params.bar_w = 10
        if(params.bar_h == null) params.bar_h = 300
        if(params.bar_x == null) params.bar_x = 200
        if(params.bar_y == null) params.bar_y = 200

        if(params.full_bar_color == null) params.full_bar_color = tinycolor("yellow")
        if(params.inner_bar_color == null) params.inner_bar_color = tinycolor("white")

        if(params.initial_scroll_percent == null) params.initial_scroll_percent = 0.5
        if(params.scroll_size_percent == null) params.scroll_size_percent = 0.1

        if(params.mouse_draggable == null) params.mouse_draggable = true

        this.pixi_app = pixi_app
        this.params = params
        this.scroll_size_percent = params.scroll_size_percent

        this.init()

    }

    private init() {

        this.setScrollBarPosition(new Victor(this.params.bar_x, this.params.bar_y), true)

        this.setScrollBarSize(new Victor(this.params.bar_w, this.params.bar_h))

        this.setScrollPosition(this.params.initial_scroll_percent)

        this.full_bar.filters = [ get_tint_filter(this.params.full_bar_color) ]
        this.inner_bar.filters = [ get_tint_filter(this.params.inner_bar_color) ]

        this.pixi_app.stage.addChild(this.full_bar)
        this.pixi_app.stage.addChild(this.inner_bar)

    }

    setScrollBarPosition(pos: Victor, init: boolean = false) {
        
        this.full_bar.position.set(pos.x, pos.y)

        this.setScrollPosition(this.scroll_position_percent)

    }

    setScrollPosition(pos_percentage: number) {

        switch(this.params.orientation) {

            case ScrollBarOrientation.Horizontal:

                const new_inner_bar_x = this.full_bar.position.x + (this.full_bar.width * pos_percentage) - this.inner_bar.width / 2
                this.scroll_position_percent = pos_percentage
                
                this.inner_bar.position.set(new_inner_bar_x, this.full_bar.position.y)
                break

            case ScrollBarOrientation.Vertical:

                const new_inner_bar_y = this.full_bar.position.y + (this.full_bar.height * pos_percentage) - this.inner_bar.height / 2
                this.scroll_position_percent = pos_percentage

                this.inner_bar.position.set(this.full_bar.position.x, new_inner_bar_y)
                break

        }

    }

    setScrollBarSize(size: Victor) {

        switch(this.params.orientation) {

            case ScrollBarOrientation.Horizontal:

                this.full_bar.width = size.y
                this.full_bar.height = size.x

                this.inner_bar.width = size.y * this.scroll_size_percent 
                this.inner_bar.height = size.x
                break

            case ScrollBarOrientation.Vertical:
                
                this.full_bar.width = size.x
                this.full_bar.height = size.y
                
                this.inner_bar.width = size.x 
                this.inner_bar.height = size.y * this.scroll_size_percent
                break

        }

    }

    setScrollSizePercent(percent: number) {

        this.scroll_size_percent = percent

        this.setScrollBarSize(new Victor(this.full_bar.scale.x, this.full_bar.scale.y)) //update size

    }

    getScrollSizePercent(): number {

        return this.scroll_size_percent

    }

    
    /**
     * Returns the scroll percentage
     * as a number from 0-1
     */
    getScrollPercent(): number {

        return this.scroll_position_percent

    }

    getScrollBarSize(): Victor {

        switch(this.params.orientation) {

            case ScrollBarOrientation.Horizontal:

                return new Victor(this.full_bar.height, this.full_bar.width)

            case ScrollBarOrientation.Vertical:

                return new Victor(this.full_bar.width, this.full_bar.height)

        }

    }

    getScrollBarPosition(): Victor {


        switch(this.params.orientation) {

            case ScrollBarOrientation.Horizontal:

                return new Victor(this.full_bar.position.x, this.full_bar.position.y)

            case ScrollBarOrientation.Vertical:

                return new Victor(this.full_bar.position.y, this.full_bar.position.x)

        }
    }

}