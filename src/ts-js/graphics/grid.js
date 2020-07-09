const global_vars = require('../global_variables');
const file_util = require('../util/file_util');
const color_util = require('../util/color_util');

const tiny_color = require('tinycolor2')

class GridShad {

    constructor(params) {
        
        this.PIXI = require('pixi.js')

        global_vars.setGlobalIfUndefined("grid_fragshader", function() {
            return file_util.loadFileStr(path.join(__dirname, '../../glsl/grid_fragshader.frag'))
        })

        this.rect = this.PIXI.Sprite.from(this.PIXI.Texture.WHITE)

        this.rect.filters = [ null ]

        this.setParameters(params)

        this.rect.filters[0] = new this.PIXI.Filter('', global_vars.getCachedGlobal("grid_fragshader"), params)

    }

    addFilter(filter) { this.rect.filters.push(filter) }

    resize(vpw, vph) {

        this.params.vpw = vpw
        this.params.vph = vph

        this.setParameters(this.params)

    }

    setParameters(params) {

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

    setSize(width, height) {

        this.params.width = width
        this.params.height = height

        this.setParameters(this.params)

    }

    setPitch(width, height) {

        this.params.pitch = [width, height]
        
        this.setParameters(this.params)

    }

    setPosition(x, y) {

        this.rect.x = x
        this.rect.y = y

        this.params.position = [x, y]

        this.setParameters(this.params)

    }

    setGridLineColor(color) { 
        
        this.params.line_color = color

        this.setParameters(this.params)

    }

    getSize() { return [this.params.width, this.params.height] }

    getRect() { return this.rect }

    getPitch() { return this.params.pitch }

    getParameters() { return this.params }

    getPosition() { return [this.rect.x, this.rect.y] }

}

module.exports.Grid = class Grid {

    gShad = null

    params = {}

    constructor(params) {

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

    getRect() { return this.gShad.getRect() }

    getSize() { return this.gShad.getSize() }

    getPosition() { return this.gShad.getPosition() }

    vpResize(vpw, vph) { this.gShad.resize(vpw, vph) }

    setPosition(x, y) { this.gShad.setPosition(x, y) }

    setSize(width, height) { 

        this.gShad.setSize(width, height) 

        const pitch_w = width / this.params.sqs_width
        const pitch_h = height / this.params.sqs_height

        this.gShad.setPitch(pitch_w, pitch_h)

        const avg_pitch = (pitch_w + pitch_h) / 2
        const multiply_by = (avg_pitch / 8) * 100

        const newColor = tiny_color(this.initial_line_color.toHexStr())

//        newColor.darken((newColor.getBrightness() / 255) * multiply_by)

//        this.gShad.setGridLineColor(color_util.toDecimalRGBArray4(newColor))

    }

    addResizeEvent(html_window) {

        const gs = this.gShad //we need a local variable of the gridshad

        gs.resize(window.innerWidth, window.innerHeight)

        html_window.addEventListener('resize', function() { 
            gs.resize(window.innerWidth, window.innerHeight)
        })

    }

}

module.exports.GridShad = GridShad