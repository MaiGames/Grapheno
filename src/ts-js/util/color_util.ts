import "tinycolor2"

export type Color = tinycolor.Instance

export function toDecimalRGBArray4(color: Color) {

    if(color == null) return null

    const rgba = color.toRgb()

    return [rgba.r / 255, 
            rgba.g / 255, 
            rgba.b / 255,
            rgba.a / 255] 

}

export function toDecimalRGBArray3(color: Color) {

    if(color == null) return null

    const rgba = color.toRgb()

    return [rgba.r / 255, 
            rgba.g / 255, 
            rgba.b / 255]

}

export function toRGBArray4(color: Color) {

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