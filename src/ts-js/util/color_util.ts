import "tinycolor2"

type Color = tinycolor.Instance

module.exports.toDecimalRGBArray4 = function(color: Color) {

    if(color == null) return null

    const rgba = color.toRgb()

    return [rgba.r / 255, 
            rgba.g / 255, 
            rgba.b / 255,
            rgba.a / 255] 

}

module.exports.toDecimalRGBArray3 = function(color: Color) {

    if(color == null) return null

    const rgba = color.toRgb()

    return [rgba.r / 255, 
            rgba.g / 255, 
            rgba.b / 255]

}

module.exports.toRGBArray4 = function(color: Color) {

    if(color == null) return null

    const rgba = color.toRgb()

    return [rgba.r, 
            rgba.g, 
            rgba.b,
            rgba.a] 

}


export function toRGBArray3(color: Color) {

    if(color == null) return null

    const rgba = color.toRgb()

    return [rgba.r, 
            rgba.g, 
            rgba.b] 

}