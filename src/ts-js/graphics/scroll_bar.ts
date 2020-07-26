import { IHash } from "../interfaces"
import tinycolor from "tinycolor2"

import Victor from "victor"

import * as PIXI from "pixi.js"
import { Color } from "../util/color_util"

import { tint_filter } from "./tint"

export enum ScrollBarOrientation { Vertical, Horizontal }

const k_size_multiplier = 335

export class ScrollBar {

    params: IHash

    orientation = ScrollBarOrientation.Horizontal

    pixi_app: PIXI.Application

    full_bar = PIXI.Sprite.from(PIXI.Texture.WHITE)
    inner_bar = PIXI.Sprite.from(PIXI.Texture.WHITE)

    scroll_position_percent = 0

    constructor(params: IHash, pixi_app: PIXI.Application) {

        if(params.orientation == null) params.orientation = ScrollBarOrientation.Vertical

        if(params.bar_w == null) params.bar_w = 1
        if(params.bar_h == null) params.bar_h = 30
        if(params.bar_x == null) params.bar_x = 200
        if(params.bar_y == null) params.bar_y = 200

        if(params.full_bar_color == null) params.full_bar_color = tinycolor("yellow")
        if(params.inner_bar_color == null) params.inner_bar_color = tinycolor("white")

        if(params.initial_scroll_percent == null) params.initial_scroll_percent = 1
        if(params.scroll_size_percent == null) params.scroll_size_percent = 0.2

        if(params.mouse_draggable == null) params.mouse_draggable = true

        this.pixi_app = pixi_app
        this.params = params

        this.init()

    }

    private init() {

        this.setScrollBarPosition(new Victor(this.params.bar_x, this.params.bar_y), true)

        this.setScrollBarSize(new Victor(this.params.bar_w, this.params.bar_h))

        this.setScrollPosition(this.params.initial_scroll_percent)

        this.full_bar.filters = [ tint_filter(this.params.full_bar_color) ]
        this.inner_bar.filters = [ tint_filter(this.params.inner_bar_color) ]

        this.pixi_app.stage.addChild(this.full_bar)
        this.pixi_app.stage.addChild(this.inner_bar)

    }

    setScrollBarPosition(pos: Victor, init: boolean = false) {
        
        this.full_bar.position.set(pos.x, pos.y)

        switch(this.params.orientation) {

            case ScrollBarOrientation.Horizontal:

                if(init)
                    this.inner_bar.position.set(pos.y, pos.x)
                else
                    this.inner_bar.position.set(this.inner_bar.position.x, pos.x)

                break

            case ScrollBarOrientation.Vertical:


                if(init)
                    this.inner_bar.position.set(pos.x, pos.y)
                else
                    this.inner_bar.position.set(pos.x, this.inner_bar.position.y)

                break

        }

    }

    setScrollPosition(pos_percentage: number) {

        switch(this.params.orientation) {

            case ScrollBarOrientation.Horizontal:

                const new_inner_bar_x = this.full_bar.position.x + (this.full_bar.scale.x * pos_percentage)
                this.scroll_position_percent = pos_percentage
                
                this.inner_bar.position.set(new_inner_bar_x, this.full_bar.position.y)
                break

            case ScrollBarOrientation.Vertical:

                const new_inner_bar_y = this.full_bar.position.y + (this.full_bar.scale.y * pos_percentage) * (k_size_multiplier / this.full_bar.scale.y)
                this.scroll_position_percent = pos_percentage

                console.log(this.full_bar.scale.y) // 30
                console.log(this.full_bar.position.y) //200
                console.log(pos_percentage) //1
                console.log(new_inner_bar_y)

                this.inner_bar.position.set(this.full_bar.position.x, new_inner_bar_y)
                break

        }

    }

    setScrollBarSize(size: Victor) {

        switch(this.params.orientation) {

            case ScrollBarOrientation.Horizontal:

                this.full_bar.scale.set(size.y, size.x)
                this.inner_bar.scale.set(size.y * this.params.scroll_size_percent, size.x)
                break

            case ScrollBarOrientation.Vertical:

                this.full_bar.scale.set(size.x, size.y)
                this.inner_bar.scale.set(size.x, size.y * this.params.scroll_size_percent)
                break

        }

    }

    setScrollSizePercent(percent: number) {

        this.params.scroll_size_percent = percent

        this.setScrollBarSize(new Victor(this.full_bar.scale.x, this.full_bar.scale.y)) //update size

    }

    getSize(): Victor {

        switch(this.params.orientation) {

            case ScrollBarOrientation.Horizontal:

                return new Victor(this.full_bar.scale.x, this.full_bar.scale.y)

            case ScrollBarOrientation.Vertical:

                return new Victor(this.full_bar.scale.y, this.full_bar.scale.x)

        }

    }

    /**
     * Returns the scroll percentage
     * as a number from 0-1
     */
    getScrollPercent(): number {

        return this.scroll_position_percent

    }

}