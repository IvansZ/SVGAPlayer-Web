import Renderer from './renderer'
import Animator from './animator'

export default class Player implements Player {
  public loops = 0;
  public clearsAfterStop = true
  public fillMode = 'Forward'

  public container?: HTMLCanvasElement | null

  public renderer: any
  public videoItem: any
  public animator: any
  public globalTransform: any
  private dynamicImage = { }
  private dynamicImageTransform = { }
  private dynamicText = { }

  constructor (elementSelector: string) {
    elementSelector && (this.container = <HTMLCanvasElement>document.body.querySelector(elementSelector))

    this._init()
  }

  public setVideoItem (videoItem: any) {
    this.currentFrame = 0
    this.videoItem = videoItem
    this.renderer.prepare()
    this.clear()
    this._update()
  }

  public setContentMode (contentMode: any) {
    this.contentMode = contentMode
    this._update()
  }

  public setClipsToBounds (clipsToBounds: any) {
    if (this.container instanceof HTMLDivElement) {
      this.container.style.overflowX = this.container.style.overflowY = clipsToBounds ? 'hidden' : null
    }
  }

  public startAnimation (reverse: any) {
    this.stopAnimation(false)
    this._doStart(undefined, reverse, undefined)
  }

  public startAnimationWithRange (range: any, reverse: any) {
    this.stopAnimation(false)
    this._doStart(range, reverse, undefined)
  }

  public pauseAnimation () {
    this.stopAnimation(false)
  }

  public stopAnimation (clear: any) {
    if (this.animator !== undefined) {
      this.animator.stop()
    }

    if (clear === undefined) {
      clear = this.clearsAfterStop
    }

    if (clear) {
      this.clear()
    }
  }

  public clear () {
    this.renderer.clear()
  }

  public stepToFrame (frame: any, andPlay: any) {
    if (frame >= this.videoItem.frames || frame < 0) {
      return void 0
    }

    this.pauseAnimation()

    this.currentFrame = frame

    this._update()

    if (andPlay) {
      this._doStart(undefined, false, this.currentFrame)
    }
  }

  public stepToPercentage (percentage: any, andPlay: any) {
    let frame = parseInt((percentage * this.videoItem.frames).toString())

    if (frame >= this.videoItem.frames && frame > 0) {
      frame = this.videoItem.frames - 1
    }

    this.stepToFrame(frame, andPlay)
  }

  public _onFinished: any

  public onFinished (callback: any) {
    this._onFinished = callback
  }

  public onFrame (callback: any) {
    this._onFrame = callback
  }

  public onPercentage (callback: any) {
    this._onPercentage = callback
  }

  public drawOnContext (ctx: any, x: any, y: any, width: any, height: any) {
    if (this.container && this.videoItem) {
      ctx.drawImage(this.container, x, y, width || this.videoItem.videoSize.width, height || this.videoItem.videoSize.height)
    }
  }

  /**
   * Private methods & properties
   */
  private contentMode = 'AspectFit'
  private currentFrame = 0;

  _onFrame: any;
  _onPercentage: any;

  _init () {
    this.renderer = new Renderer(this)
  }

  _doStart (range: any, reverse: any, fromFrame: any) {
    this.animator = new Animator()

    if (range !== undefined) {
      this.animator.startValue = Math.max(0, range.location)
      this.animator.endValue = Math.min(this.videoItem.frames - 1, range.location + range.length)
      this.animator.duration = (this.animator.endValue - this.animator.startValue + 1) * (1.0 / this.videoItem.FPS) * 1000
    } else {
      this.animator.startValue = 0
      this.animator.endValue = this.videoItem.frames - 1
      this.animator.duration = this.videoItem.frames * (1.0 / this.videoItem.FPS) * 1000
    }

    this.animator.loops = this.loops <= 0 ? Infinity : 1
    this.animator.fillRule = this.fillMode === 'Backward' ? 1 : 0

    this.animator.onUpdate = (value: any) => {
      if (this.currentFrame === Math.floor(value)) {
        return void 0
      }

      this.currentFrame = Math.floor(value)

      this._update()

      if (typeof this._onFrame === 'function') {
        this._onFrame(this.currentFrame)
      }

      if (typeof this._onPercentage === 'function') {
        this._onPercentage(parseFloat((this.currentFrame + 1).toString()) / parseFloat(this.videoItem.frames))
      }
    }

    this.animator.onEnd = () => {
      if (this.clearsAfterStop === true) {
        this.clear()
      }

      if (typeof this._onFinished === 'function') {
        this._onFinished()
      }
    }

    if (reverse === true) {
      this.animator.reverse(fromFrame)
    } else {
      this.animator.start(fromFrame)
    }
  }

  _resize () {
    let asParent = false

    if (this.container) {
      let scaleX = 1.0
      let scaleY = 1.0
      let translateX = 0.0
      let translateY = 0.0

      let targetSize: any = this.videoItem.videoSize

      let imageSize = this.videoItem.videoSize

      if (targetSize.width >= imageSize.width && targetSize.height >= imageSize.height) {
        this.container.width = targetSize.width
        this.container.height = targetSize.height
        this.container.style.webkitTransform = this.container.style.transform = ''
        asParent = true
      } else {
        this.container.width = imageSize.width
        this.container.height = imageSize.height

        if (this.contentMode === 'Fill') {
          const scaleX = targetSize.width / imageSize.width
          const scaleY = targetSize.height / imageSize.height
          const translateX = (imageSize.width * scaleX - imageSize.width) / 2.0
          const translateY = (imageSize.height * scaleY - imageSize.height) / 2.0
          this.container.style.webkitTransform = this.container.style.transform = `matrix( ${scaleX}, 0.0, 0.0, ${scaleY}, ${translateX}, ${translateY} )`
        } else if (this.contentMode === 'AspectFit' || this.contentMode === 'AspectFill') {
          const imageRatio = imageSize.width / imageSize.height
          const viewRatio = targetSize.width / targetSize.height

          if ((imageRatio >= viewRatio && this.contentMode === 'AspectFit') || (imageRatio < viewRatio && this.contentMode === 'AspectFill')) {
            const scale = targetSize.width / imageSize.width
            const translateX = (imageSize.width * scale - imageSize.width) / 2.0
            const translateY = (imageSize.height * scale - imageSize.height) / 2.0 + (targetSize.height - imageSize.height * scale) / 2.0

            this.container.style.webkitTransform = this.container.style.transform = `matrix( ${scale}, 0.0, 0.0, ${scale}, ${translateX}, ${translateY} )`
          } else if ((imageRatio < viewRatio && this.contentMode === 'AspectFit') || (imageRatio > viewRatio && this.contentMode === 'AspectFill')) {
            const scale = targetSize.height / imageSize.height
            const translateX = (imageSize.width * scale - imageSize.width) / 2.0 + (targetSize.width - imageSize.width * scale) / 2.0
            const translateY = (imageSize.height * scale - imageSize.height) / 2.0
            this.container.style.webkitTransform = this.container.style.transform = `matrix( ${scale}, 0.0, 0.0, ${scale}, ${translateX}, ${translateY} )`
          }
        }

        this.globalTransform = undefined
      }
    }

    if (this.container === undefined || asParent === true) {
      let scaleX: Number| any = 1.0
      let scaleY: Number | any= 1.0
      let translateX: Number | any = 0.0
      let translateY: Number | any = 0.0

      let targetSize = { width: this.container ? this.container.clientWidth : 0.0, height: this.container ? this.container.clientHeight : 0.0 }

      let imageSize = this.videoItem.videoSize

      if (this.contentMode === 'Fill') {
        scaleX = targetSize.width / imageSize.width
        scaleY = targetSize.height / imageSize.height
      } else if (this.contentMode === 'AspectFit' || this.contentMode === 'AspectFill') {
        const imageRatio = imageSize.width / imageSize.height
        const viewRatio = targetSize.width / targetSize.height

        if ((imageRatio >= viewRatio && this.contentMode === 'AspectFit') || (imageRatio <= viewRatio && this.contentMode === 'AspectFill')) {
          scaleX = scaleY = targetSize.width / imageSize.width
          translateY = (targetSize.height - imageSize.height * scaleY) / 2.0
        } else if ((imageRatio < viewRatio && this.contentMode === 'AspectFit') || (imageRatio > viewRatio && this.contentMode === 'AspectFill')) {
          scaleX = scaleY = targetSize.height / imageSize.height
          translateX = (targetSize.width - imageSize.width * scaleX) / 2.0
        }
      }

      this.globalTransform = { a: scaleX, b: 0.0, c: 0.0, d: scaleY, tx: translateX, ty: translateY }
    }
  }

  _update () {
    if (this.videoItem === undefined) { return void 0 }
    this._resize()
    this.renderer.drawFrame(this.currentFrame)
  }
}
