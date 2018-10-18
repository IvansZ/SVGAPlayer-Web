/// <reference path="../types/svga.d.ts" />

const WORKER = '#INLINE_WROKER#'

export default class Parser implements Parser {
  static _worker?: any

  constructor ({ worker } = { worker: true }) {
    if (worker) {
      Parser._worker = new Worker(window.URL.createObjectURL(new Blob([WORKER])))
    } else {
      /* eslint-disable */
      eval(WORKER)
      Parser._worker = (<any>window).SVGAMockWorker
    }
  }

  do (data: ArrayBuffer): void | Promise<Object> {
    if (!data) {
      throw new Error('Parser Data not found')
    }

    if (!Parser._worker) {
      throw new Error('Parser Worker not found')
    }

    return new Promise((resolve, reject) => {
      if (Parser._worker.mock) {
        Parser._worker.onmessageCallback = (data: VideoEntity) => {
          resolve(data)
        }

        Parser._worker.onmessage({data})
      } else {
         Parser._worker.postMessage(data)

        Parser._worker.onmessage = ({ data }: { data: VideoEntity}) => {
          resolve(data)
        }
      }
    })
  }
}
