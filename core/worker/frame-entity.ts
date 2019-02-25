import BezierPath from '../common/bezier-path'

const transformMake = (a: number, b: number, c: number, d: number, tx: number, ty: number): Transform => {
  return { a, b, c, d, tx, ty }
}

const rectMake = (x: number, y: number, width: number, height: number): Rect => {
  return { x, y, width, height }
}

export default class FrameEntity implements FrameEntity {
  static lastShapes: string = ''

  public alpha = 0.0
  public transform = transformMake(1, 0, 0, 1, 0, 0)
  public nx = 0.0
  public ny = 0.0
  public layout = rectMake(0, 0, 0, 0)
  public maskPath: any
  public shapes: any = []

  constructor (spec: any) {
    this.alpha = parseFloat(spec.alpha) || 0.0

    spec.layout && (this.layout = rectMake(
      parseFloat(spec.layout.x) || 0.0,
      parseFloat(spec.layout.y) || 0.0,
      parseFloat(spec.layout.width) || 0.0,
      parseFloat(spec.layout.height) || 0.0
    ))

    spec.transform && (this.transform = transformMake(
      parseFloat(spec.transform.a) || 1.0,
      parseFloat(spec.transform.b) || 0.0,
      parseFloat(spec.transform.c) || 0.0,
      parseFloat(spec.transform.d) || 1.0,
      parseFloat(spec.transform.tx) || 0.0,
      parseFloat(spec.transform.ty) || 0.0
    ))

    spec.clipPath && spec.clipPath.length > 0 && (this.maskPath = new BezierPath(spec.clipPath, undefined, { fill: '#000000' }))

    if (spec.shapes) {
      if (spec.shapes instanceof Array) {
        spec.shapes.forEach((shape: any) => {
          shape.pathArgs = shape.args

          switch (shape.type) {
            case 0:
              shape.type = 'shape'
              shape.pathArgs = shape.shape
              break
            case 1:
              shape.type = 'rect'
              shape.pathArgs = shape.rect
              break
            case 2:
              shape.type = 'ellipse'
              shape.pathArgs = shape.ellipse
              break
            case 3:
              shape.type = 'keep'
              break
          }

          if (shape.styles) {
            if (shape.styles.fill) {
              if (typeof shape.styles.fill['r'] === 'number') shape.styles.fill[0] = shape.styles.fill['r']
              if (typeof shape.styles.fill['g'] === 'number') shape.styles.fill[1] = shape.styles.fill['g']
              if (typeof shape.styles.fill['b'] === 'number') shape.styles.fill[2] = shape.styles.fill['b']
              if (typeof shape.styles.fill['a'] === 'number') shape.styles.fill[3] = shape.styles.fill['a']
            }

            if (shape.styles.stroke) {
              if (typeof shape.styles.stroke['r'] === 'number') shape.styles.stroke[0] = shape.styles.stroke['r']
              if (typeof shape.styles.stroke['g'] === 'number') shape.styles.stroke[1] = shape.styles.stroke['g']
              if (typeof shape.styles.stroke['b'] === 'number') shape.styles.stroke[2] = shape.styles.stroke['b']
              if (typeof shape.styles.stroke['a'] === 'number') shape.styles.stroke[3] = shape.styles.stroke['a']
            }

            let lineDash = shape.styles.lineDash || []

            if (shape.styles.lineDashI > 0) {
              lineDash.push(shape.styles.lineDashI)
            }

            if (shape.styles.lineDashII > 0) {
              if (lineDash.length < 1) { lineDash.push(0) }
              lineDash.push(shape.styles.lineDashII)
              lineDash.push(0)
            }

            if (shape.styles.lineDashIII > 0) {
              if (lineDash.length < 2) { lineDash.push(0); lineDash.push(0) }
              lineDash[2] = shape.styles.lineDashIII
            }

            shape.styles.lineDash = lineDash

            switch (shape.styles.lineJoin) {
              case 0:
                shape.styles.lineJoin = 'miter'
                break
              case 1:
                shape.styles.lineJoin = 'round'
                break
              case 2:
                shape.styles.lineJoin = 'bevel'
                break
            }

            switch (shape.styles.lineCap) {
              case 0:
                shape.styles.lineCap = 'butt'
                break
              case 1:
                shape.styles.lineCap = 'round'
                break
              case 2:
                shape.styles.lineCap = 'square'
                break
            }
          }
        })
      }

      if (spec.shapes[0] && spec.shapes[0].type === 'keep') {
        this.shapes = FrameEntity.lastShapes
      } else {
        FrameEntity.lastShapes = spec.shapes
        this.shapes = spec.shapes
      }
    }

    let llx = this.transform.a * this.layout.x + this.transform.c * this.layout.y + this.transform.tx
    let lrx = this.transform.a * (this.layout.x + this.layout.width) + this.transform.c * this.layout.y + this.transform.tx
    let lbx = this.transform.a * this.layout.x + this.transform.c * (this.layout.y + this.layout.height) + this.transform.tx
    let rbx = this.transform.a * (this.layout.x + this.layout.width) + this.transform.c * (this.layout.y + this.layout.height) + this.transform.tx
    let lly = this.transform.b * this.layout.x + this.transform.d * this.layout.y + this.transform.ty
    let lry = this.transform.b * (this.layout.x + this.layout.width) + this.transform.d * this.layout.y + this.transform.ty
    let lby = this.transform.b * this.layout.x + this.transform.d * (this.layout.y + this.layout.height) + this.transform.ty
    let rby = this.transform.b * (this.layout.x + this.layout.width) + this.transform.d * (this.layout.y + this.layout.height) + this.transform.ty

    this.nx = Math.min(Math.min(lbx, rbx), Math.min(llx, lrx))
    this.ny = Math.min(Math.min(lby, rby), Math.min(lly, lry))
  }
}
