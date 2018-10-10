export class BezierPath {
  _d?: Number
  _transform?: String
  _styles?: any

  constructor (d?: Number, transform?: String, styles?: any) {
    this._d = d
    this._transform = transform
    this._styles = styles
  }
}

export class EllipsePath extends BezierPath {
  _x?: Number
  _y?: Number
  _radiusX?: Number
  _radiusY?: Number

  constructor (x?: Number, y?: Number, radiusX?: Number, radiusY?: Number, transform?: String, styles?: any) {
    super()

    this._x = x
    this._y = y
    this._radiusX = radiusX
    this._radiusY = radiusY
    this._transform = transform
    this._styles = styles
  }
}

export class RectPath extends BezierPath {
  _x?: Number
  _y?: Number
  _width?: Number
  _height?: Number
  _cornerRadius?: Number

  constructor (x?: Number, y?: Number, width?: Number, height?: Number, cornerRadius?: Number, transform?: String, styles?: any) {
    super()

    this._x = x
    this._y = y
    this._width = width
    this._height = height
    this._cornerRadius = cornerRadius
    this._transform = transform
    this._styles = styles
  }
}
