enum EVENT_TYPES {
  START = 'start',
  PROCESS = 'process',
  PAUSE = 'pause',
  STOP = 'stop',
  END = 'end',
  CLEAR = 'clear'
}

enum FILL_MODE {
  FORWARDS = 'forwards',
  BACKWARDS = 'backwards'
}

interface options {
  loop: number | Boolean
  fillMode: FILL_MODE
}

interface Player {
  public container: HTMLCanvasElement
  public loop: number | Boolean = true
  public fillMode: FILL_MODE = FILL_MODE.FORWARDS
  public videoItem: VideoEntity
  public currentFrame: number
}
