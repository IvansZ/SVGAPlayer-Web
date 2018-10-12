import Renderer from './renderer'
import Animator from './animator'

enum FILL_MODE {
  FORWARDS = 'forwards',
  BACKWARDS = 'backwards'
}

export default class Player implements Player {
  public container: HTMLCanvasElement
  public loop: number | Boolean = true
  public fillMode: FILL_MODE = FILL_MODE.FORWARDS
  public progress = 0
  public currentFrame = 0

  private _renderer: any
  private _animator: any

  constructor (elementSelector: string, public videoItem: VideoEntity, options?: options) {
    this.container = <HTMLCanvasElement>document.body.querySelector(elementSelector)

    if (!this.container) {
      throw new Error('container undefined.')
    }

    this._renderer = new Renderer(this)

    this.videoItem && this.mount(videoItem)
  }

  public set (options: options) {
    typeof options.loop !== 'undefined' && (this.loop = options.loop)
    options.fillMode && (this.fillMode = options.fillMode)
  }

  public mount (videoItem: VideoEntity) {
    return new Promise((resolve, reject) => {
      this.currentFrame = 0
      this.progress = 0
      this.videoItem = videoItem

      this._renderer.prepare().then(resolve)
      this.clear()
      this._setSize()
    })
  }

  public start () {
    if (!this.videoItem) {
      throw new Error('video item undefined.')
    }

    this.clear()
    this._startAnimation()

    this.$onEvent.start()
  }

  public pause () {
    this._animator.stop()
    this.$onEvent.pause()
  }

  public stop () {
    this._animator.stop()

    this.currentFrame = 0
    this._renderer.drawFrame(this.currentFrame)

    this.$onEvent.stop()
  }

  public clear () {
    this._renderer.clear()
    this.$onEvent.clear()
  }

  private $onEvent: {
    [EVENT_TYPES.START]: Function
    [EVENT_TYPES.PROCESS]: Function
    [EVENT_TYPES.PAUSE]: Function
    [EVENT_TYPES.STOP]: Function
    [EVENT_TYPES.END]: Function
    [EVENT_TYPES.CLEAR]: Function
  } = {
    start: () => {},
    process: () => {},
    pause: () => {},
    stop: () => {},
    end: () => {},
    clear: () => {}
  }

  public $on (eventName: EVENT_TYPES, execFunction: Function) {
    this.$onEvent[eventName] = execFunction

    return this
  }

  private _startAnimation () {
    this._animator = new Animator()

    this._animator.startValue = 0
    this._animator.endValue = this.videoItem.frames - 1
    this._animator.duration = this.videoItem.frames * (1.0 / this.videoItem.FPS) * 1000
    this._animator.loop = this.loop === true || this.loop <= 0 ? Infinity : (this.loop === false ? 1 : this.loop)
    this._animator.fillRule = this.fillMode === 'backwards' ? 1 : 0

    this._animator.onUpdate = (value: number) => {
      value = Math.floor(value)

      if (this.currentFrame === value) {
        return void 0
      }

      this.currentFrame = value

      // FIXME: progress 不连续
      console.log(value)
      console.log(this.videoItem.frames)
      this.progress = parseFloat((value + 1).toString()) / parseFloat(this.videoItem.frames.toString()) * 100

      this._renderer.drawFrame(this.currentFrame)

      this.$onEvent.process()
    }

    this._animator.onEnd = () => this.$onEvent.end()

    this._animator.start(this.currentFrame)
  }

  private _setSize () {
    const videoSize: VideoSize = this.videoItem.videoSize

    this.container.width = videoSize.width
    this.container.height = videoSize.height
  }
}
