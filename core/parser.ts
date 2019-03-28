/// <reference path="../types/svga.d.ts" />

const WORKER = '#INLINE_WROKER#'

export default class Parser implements Parser {
  public worker?: any

  constructor ({ disableWorker } = { disableWorker: false }) {
    if (!disableWorker) {
      this.worker = new Worker(window.URL.createObjectURL(new Blob([WORKER])))
    } else {
      /* eslint-disable */
      eval(WORKER)
      this.worker = (<any>window).SVGAMockWorker
    }
  }

  do (data: ArrayBuffer): void | Promise<Object> {
    if (!data) {
      throw new Error('Parser Data not found')
    }

    if (!this.worker) {
      throw new Error('Parser Worker not found')
    }

    return new Promise((resolve, reject) => {
      console.log(this.worker.disableWorker)
      if (this.worker.disableWorker) {
        this.worker.onmessageCallback = (data: VideoEntity) => {
          resolve(data)
        }

        this.worker.onmessage({ data })
      } else {
         this.worker.postMessage(data)

        this.worker.onmessage = ({ data }: { data: VideoEntity }) => {
          resolve(data)
        }
      }
    })
  }
}
