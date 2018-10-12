export default class Animator {
  private static _currentTimeMillsecond: () => number = () => {
    if (typeof performance === 'undefined') {
      return new Date().getTime()
    }

    return performance.now()
  }

  private static _requestAnimationFrame: (callback: () => void) => any = (callback) => {
    callback && setTimeout(callback, 16)
  }

  public startValue: number = 0
  public endValue: number = 0
  public duration: number = 0
  public loop: number = 1
  public fillRule: number = 0

  public onStart: () => any = () => {}
  public onUpdate: (currentValue: number) => any = () => {}
  public onEnd: () => any = () => {}

  public start (currentValue: number) {
    this.doStart(currentValue)
  }

  public stop () {
    this._doStop()
  }

  public get animatedValue (): number {
    return ((this.endValue - this.startValue) * this._mCurrentFrication) + this.startValue
  }

  private _mRunning = false
  private _mStartTime = 0
  private _mCurrentFrication: number = 0.0

  private doStart (currentValue: number) {
    this._mRunning = true
    this._mStartTime = Animator._currentTimeMillsecond()

    currentValue && (this._mStartTime -= currentValue / (this.endValue - this.startValue) * this.duration)

    this._mCurrentFrication = 0.0

    this.onStart()
    this._doFrame()
  }

  private _doStop () {
    this._mRunning = false
  }

  private _doFrame () {
    if (this._mRunning) {
      this._doDeltaTime(Animator._currentTimeMillsecond() - this._mStartTime)

      if (this._mRunning) {
        Animator._requestAnimationFrame(this._doFrame.bind(this))
      }
    }
  }

  private _doDeltaTime (deltaTime: number) {
    if (deltaTime >= this.duration * this.loop) {
      this._mCurrentFrication = this.fillRule === 1 ? 0.0 : 1.0
      this._mRunning = false
    } else {
      this._mCurrentFrication = (deltaTime % this.duration) / this.duration
    }

    this.onUpdate(this.animatedValue)

    if (this._mRunning === false) {
      this.onEnd()
    }
  }
}
