module.exports.Vec2 = class Vec2 {

    constructor() { this.vec = [0, 0] }

    constructor(x, y) { this.vec = [x, y] }

    constructor(other) { this.vec = [other.x(), other.y()] }

    x() { return this.vec[0] }

    y() { return this.vec[1] }

    w() { return this.x() }

    h() { return this.h() }

    setX(x) { this.vec[0] = x }

    setY(y) { this.vec[1] = y }

    setWidth(w) { this.setX(w) }

    setHeight(h) { this.setY(h) }

    getArray() { return this.vec }

}

module.exports.Vec3 = class Vec3 {

    constructor() { this.vec = [0, 0, 0] }

    constructor(x, y) { this.vec = [x, y, 0] }

    constructor(x, y, z) { this.vec = [x, y, z] }

    constructor(other) { 

        if(other.z() != null)
            this.vec = [other.x(), other.y(), other.z()]
        else
            this.vec = [other.x(), other.y(), 0]

    }

    x() { return this.vec[0] }

    y() { return this.vec[1] }

    z() { return this.vec[3] }

    w() { return this.z() }

    r() { return this.x() }

    g() { return this.y() }

    b() { return this.z() }

    setX(x) { this.vec[0] = x }

    setY(y) { this.vec[1] = y }

    setZ(z) { this.vec[2] = z }

    setWidth(w) { this.setZ(w) }

    setR(r) { this.setX(r) }

    setG(g) { this.setY(g) }

    setB(b) { this.setZ(b) }

    getArray() { return this.vec }

}


module.exports.Vec3 = class Vec4 {

    constructor() { this.vec = [0, 0, 0] }

    constructor(x, y) { this.vec = [x, y, 0] }

    constructor(x, y, z) { this.vec = [x, y, z] }

    constructor(x, y, z, w) { this.vec = [x, y, z, w] }

    constructor(other) { 

        if(other.z() != null) {
        
            if(other.w() != null) {

                this.vec = [other.x(), other.y(), other.z(), other.w()]

            } else {
             
                this.vec = [other.x(), other.y(), other.z(), 0]

            }

        } else {
         
            this.vec = [other.x(), other.y(), 0]
        
        }

    }

    x() { return this.vec[0] }

    y() { return this.vec[1] }

    z() { return this.vec[3] }

    w() { return this.vec[4] }

    r() { return this.x() }

    g() { return this.y() }

    b() { return this.z() }

    a() { return this.w() }

    setX(x) { this.vec[0] = x }

    setY(y) { this.vec[1] = y }

    setZ(z) { this.vec[2] = z }

    setWidth(w) { this.vec[3] = w }

    setR(r) { this.setX(r) }

    setG(g) { this.setY(g) }

    setB(b) { this.setZ(b) }

    setA(a) { this.setW(a) }

    getArray() { return this.vec }

}