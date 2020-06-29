module.exports.toDecimalRGBArray4 = function(color) {

    if(color == null) return null

    const rgba = color.toRgb()

    return [rgba.r / 255, 
            rgba.g / 255, 
            rgba.b / 255,
            rgba.a / 255] 

}

module.exports.toDecimalRGBArray3 = function(color) {

    if(color == null) return null

    const rgba = color.toRgb()

    return [rgba.r / 255, 
            rgba.g / 255, 
            rgba.b / 255]

}

module.exports.toRGBArray4 = function(color) {

    if(color == null) return null

    const rgba = color.toRgb()

    return [rgba.r, 
            rgba.g, 
            rgba.b,
            rgba.a] 

}


module.exports.toRGBArray3 = function(color) {

    if(color == null) return null

    const rgba = color.toRgb()

    return [rgba.r, 
            rgba.g, 
            rgba.b] 

}