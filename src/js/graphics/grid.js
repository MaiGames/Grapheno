const PIXI = require('pixi.js')

const global_vars = require('../util/global_variables');
const file_util = require('../util/file_util');

module.exports.GridShad = class GridShad {

    rect = null

    params = null

    constructor(params) {
        
        global_vars.setGlobalIfUndefined("grid_fragshader", function() {
            return file_util.loadFileStr(path.join(__dirname, '../../glsl/grid_fragshader.frag'))
        })

        this.rect = PIXI.Sprite.from(PIXI.Texture.WHITE)

        this.rect.filters = [ null ]

        this.setParameters(params)

    }

    addFilter(filter) { this.rect.filters.push(filter) }

    getRect() { return this.rect }

    setParameters(params) {

        if(params.vpw == null) params.vpw = 800;
        if(params.vph == null) params.vph = 600;
        if(params.width == null) params.width = 500;
        if(params.height == null) params.height = 500;
        if(params.pitch == null) params.pitch = [50, 50]
        if(params.line_color == null) params.line_color = [ 0, 0, 0, 0.5 ]
        if(params.border_color == null) params.border_color = [ 1, 1, 1, 1 ]
        if(params.border_size == null) params.border_size = 5

        params.position = [0, 0]

        this.rect.width = params.width
        this.rect.height = params.height

        params.position[0] = this.rect.x;
        params.position[1] = this.rect.y;

        this.rect.filters[0] = new PIXI.Filter('', global_vars.getCachedGlobal("grid_fragshader"), params)

        this.params = params

    }

    setSize(width, height) {

        this.params.width = width
        this.params.height = height

        this.rect.width = width
        this.rect.height = height

        this.setParameters(this.params)

    }

    resize(vpw, vph) {

        this.params.vpw = vpw
        this.params.vph = vph

        this.params.position = [this.rect.x, this.rect.y]

        this.setParameters(this.params)

    }

    setPosition(x, y) {

        this.rect.x = x
        this.rect.y = y

        this.params.position = [x, y]

        this.setParameters(this.params)

    }

    getSize() { return this.params.size }

}

module.exports.Grid = class Grid {

    gShad = null

    params = {}

    constructor(params) {

        if(params.vpw == null) params.vpw = 800;
        if(params.vph == null) params.vph = 600;
        if(params.sqs_width == null) params.sqs_width = 12;
        if(params.sqs_height == null) params.sqs_height = 12;
        if(params.rect_width == null) params.rect_width = 40;
        if(params.rect_height == null) params.rect_height = 40;
        if(params.line_color == null) params.line_color = [1, 1, 1, 0];
        if(params.border_color == null) params.border_color = [ 1, 1, 1, 1 ]
        if(params.border_size == null) params.border_size = 5

        const pitch_w = params.rect_width / params.sqs_width
        const pitch_h = params.rect_height / params.sqs_height

        this.gShad = new gh_grid.GridShad({
            vpw: params.vpw,
            vph: params.vph,
            width: params.rect_width,
            height: params.rect_height,
            pitch: [ pitch_w, pitch_h ],
            line_color: params.line_color,
            border_color: params.border_color,
            border_size: params.border_size
        })

    }

    getRect() { return this.gShad.getRect() }

    vpResize(vpw, vph) { this.gShad.resize(vpw, vph) }

    setPosition(x, y) { this.gShad.setPosition(x, y) }

    addResizeEvent(html_window) {

        const gs = this.gShad //we need a local variable of the gridshad

        gs.resize(window.innerWidth, window.innerHeight)

        html_window.addEventListener('resize', function() { 
            gs.resize(window.innerWidth, window.innerHeight)
        })

    }

}