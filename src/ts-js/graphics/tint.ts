import { Color } from "../util/color_util";

import * as PIXI from 'pixi.js'
import path from 'path'

import * as globals from '../global'
import * as file_util from '../util/file_util'
import * as color_util from '../util/color_util'

export function tint_filter(tint_color: Color): PIXI.Filter {

    globals.setGlobalIfUndefined("tint_fragshader", function() { 
        return file_util.load_file(path.join(__dirname, '../../glsl/tint.frag')) 
    })

    const color = color_util.toDecimalRGBArray4(tint_color)

    const filter = new PIXI.Filter('', globals.getCachedGlobal("tint_fragshader"), { 
        tint_color: color 
    })

    return filter

}