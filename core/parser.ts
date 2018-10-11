/// <reference path="../types/svga.d.ts" />

export default class Parser implements Parser {
  public worker?: Worker

  constructor () {
    this.worker = new Worker(window.URL.createObjectURL(new Blob(['#INLINE_WROKER#'])))
  }

  do (data: ArrayBuffer): void | Promise<Object> {
    if (!data) {
      throw new Error('Parser Data not found')
    }

    if (!this.worker) {
      throw new Error('Parser Worker not found')
    }

    return new Promise((resolve, reject) => {
      data && this.worker && this.worker.postMessage(data)

      this.worker && (this.worker.onmessage = ({ data }) => {
        resolve(data)
      })
    })
  }
}
