export default class Parser implements Parser {
  public workerAddress = ''
  public worker?: Worker

  constructor (workerAddress: string) {
    if (workerAddress) {
      this.workerAddress = workerAddress
      this.worker = new Worker(workerAddress)
    }
  }

  do (data: ArrayBuffer): Promise<Object> {
    return new Promise((resolve, reject) => {
      data && this.worker && this.worker.postMessage(data)

      this.worker && (this.worker.onmessage = ({ data }) => {
        resolve(data)
      })
    })
  }
}
