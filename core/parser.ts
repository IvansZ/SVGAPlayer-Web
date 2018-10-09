/// <reference path="../types/svga.d.ts" />

export default class Parser implements Parser {
  public workerAddress = 'http://legox.yy.com/lijialiang/svga.lite.worker.min.js'
  public worker?: Worker

  initWorker (workerAddress: string): Promise<void> {
    workerAddress && (this.workerAddress = workerAddress)

    return new Promise((resolve, reject) => {
      this.createWorkerFromXMLHttpRequest(this.workerAddress).then(worker => {
        this.worker = worker

        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  }

  createWorkerFromXMLHttpRequest (workerAddress: string): Promise<Worker> {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()

      try {
        request.addEventListener('load', function () {
          resolve(new Worker(window.URL.createObjectURL(new Blob([this.responseText]))))
        }, true)
      } catch (error) {
        reject(error)
      }

      request.open('get', workerAddress, true)

      request.send()
    })
  }

  do (data: ArrayBuffer): void | Promise<SVGAFileData> {
    if (!data) { throw new Error('Parser Data not found') }
    if (!this.worker) { throw new Error('Parser Worker not found') }

    return new Promise((resolve, reject) => {
      data && this.worker && this.worker.postMessage(data)

      this.worker && (this.worker.onmessage = ({ data }) => {
        resolve(data)
      })
    })
  }
}
