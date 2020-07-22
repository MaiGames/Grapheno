import { IHash } from "../interfaces"
import tinycolor from "tinycolor2"

export enum ScrollBarOrientation { Vertical, Horizontal }

export class ScrollBar {

    params: IHash

    orientation = ScrollBarOrientation.Horizontal

    pixi_app: PIXI.Application

    full_bar = PIXI.Sprite.from(PIXI.Texture.WHITE)
    inner_bar = PIXI.Sprite.from(PIXI.Texture.WHITE)

    scroll_x = 0
    scroll_y = 0

    scroll_dimension = 200

    constructor(params: IHash, pixi_app: PIXI.Application) {

        if(params.orientation == null) params.orientation = ScrollBarOrientation.Horizontal

        if(params.bar_w == null) params.bar_w = 200
        if(params.bar_h == null) params.bar_h = 50
        if(params.bar_x == null) params.bar_x = 200
        if(params.bar_y == null) params.bar_y = 200

        if(params.full_bar_color == null) params.full_bar_color = tinycolor("white")
        if(params.inner_bar_color == null) params.full_bar_color = tinycolor("gray")
 
        if(params.mouse_draggable == null) params.mouse_draggable = true

        this.pixi_app = pixi_app
        
        this.params = params

        this.init()

    }

    private init() {

        this.full_bar.position.set(this.params.bar_x, this.params.bar_y)
        
        switch(this.params.orientation) {

            case ScrollBarOrientation.Horizontal:

                this.full_bar.scale.set(this.params.bar_w, this.params.bar_h)
                break
            
            case ScrollBarOrientation.Vertical:

                this.full_bar.scale.set(this.params.bar_h, this.params.bar_w)
                break

        }

    }

}