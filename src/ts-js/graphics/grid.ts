import * as globals from '../global'
import { IHash } from '../util/interfaces';

import * as PIXI from 'pixi.js'

import * as path from 'path'

import * as file_util from '../util/file_util'
import * as color_util from '../util/color_util'

import tinycolor from 'tinycolor2';

type Color = tinycolor.Instance

export class GridShad {

    rect: PIXI.Sprite
    params: IHash  = { }

    constructor(params: IHash) {
        
        globals.setGlobalIfUndefined("grid_fragshader", function() {
            return file_util.loadFileStr(path.join(__dirname, '../../glsl/grid_fragshader.frag'))
        })

        this.rect = PIXI.Sprite.from(PIXI.Texture.WHITE)

        this.setParameters(params)

        this.rect.filters = [ new PIXI.Filter('', globals.getCachedGlobal("grid_fragshader"), params) ]

    }

    addFilter(filter: PIXI.Filter) { this.rect.filters.push(filter) }

    resize(vpw: number, vph: number) {

        this.params.vpw = vpw
        this.params.vph = vph

        this.setParameters(this.params)

    }

    setParameters(params: IHash) {

        if(params.vpw == null) params.vpw = 800;
        if(params.vph == null) params.vph = 600;
        if(params.width == null) params.width = 500;
        if(params.height == null) params.height = 500;
        if(params.pitch == null) params.pitch = [50, 50]
        if(params.line_color == null) params.line_color = [ 1, 1, 1, 1 ]
        if(params.border_color == null) params.border_color = [ 1, 1, 1, 1 ]
        if(params.border_size == null) params.border_size = 5

        params.position = [0, 0]

        this.rect.width = params.width
        this.rect.height = params.height

        params.position[0] = this.rect.x;
        params.position[1] = this.rect.y;

        this.params = params

    }

    setSize(width: number, height: number) {

        this.params.width = width
        this.params.height = height

        this.setParameters(this.params)

    }

    setPitch(width: number, height: number) {

        this.params.pitch = [width, height]
        
        this.setParameters(this.params)

    }

    setPosition(x: number, y: number) {

        this.rect.x = x
        this.rect.y = y

        this.params.position = [x, y]

        this.setParameters(this.params)

    }

    setGridLineColor(color: Color) { 
        
        this.params.line_color = color

        this.setParameters(this.params)

    }

    getSize(): Array<number> { return [this.params.width, this.params.height] }

    getRect(): PIXI.Sprite { return this.rect }

    getPitch(): number { return this.params.pitch }

    getParameters(): IHash { return this.params }

    getPosition(): Array<number> { return [this.rect.x, this.rect.y] }

}

export class Grid {

    gShad!: GridShad

    params: IHash = {}

    initial_line_color: Color;

    constructor(params: IHash) {

        if(params.vpw == null) params.vpw = 800
        if(params.vph == null) params.vph = 600
        if(params.sqs_width == null) params.sqs_width = 12
        if(params.sqs_height == null) params.sqs_height = 12
        if(params.rect_width == null) params.rect_width = 40
        if(params.rect_height == null) params.rect_height = 40
        if(params.border_size == null) params.border_size = 5

        this.initial_line_color = params.line_color

        const pitch_w = params.rect_width / params.sqs_width
        const pitch_h = params.rect_height / params.sqs_height

        const avg_pitch = (pitch_w + pitch_h) / 2
        const multiply_by = (avg_pitch / 8) * 100

//        params.line_color.darken((params.line_color.getBrightness() / 255) * multiply_by)

        this.gShad = new GridShad({

            vpw: params.vpw,
            vph: params.vph,

            width: params.rect_width,
            height: params.rect_height,

            pitch: [ pitch_w, pitch_h ],
            border_size: params.border_size,

            line_color: color_util.toDecimalRGBArray4(params.line_color),
            border_color: color_util.toDecimalRGBArray4(params.border_color)

        })

        this.params = params

    }

    getRect(): PIXI.Sprite { return this.gShad.getRect() }

    getSize(): Array<number> { return this.gShad.getSize() }

    getPosition(): Array<number> { return this.gShad.getPosition() }

    vpResize(vpw: number, vph: number) { this.gShad.resize(vpw, vph) }

    setPosition(x: number, y: number) { this.gShad.setPosition(x, y) }

    setSize(width: number, height: number) { 

        this.gShad.setSize(width, height) 

        const pitch_w = width / this.params.sqs_width
        const pitch_h = height / this.params.sqs_height

        this.gShad.setPitch(pitch_w, pitch_h)

        const avg_pitch = (pitch_w + pitch_h) / 2
        const multiply_by = (avg_pitch / 8) * 100

        const newColor = tinycolor(this.initial_line_color.toHexString())

//        newColor.darken((newColor.getBrightness() / 255) * multiply_by)

//        this.gShad.setGridLineColor(color_util.toDecimalRGBArray4(newColor))

    }

    addResizeEvent(html_window: Window) {

        const gs = this.gShad //we need a local variable of the gridshad

        gs.resize(window.innerWidth, window.innerHeight)

        html_window.addEventListener('resize', function() { 
            gs.resize(window.innerWidth, window.innerHeight)
        })

    }

}