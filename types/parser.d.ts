interface Parser {
  workerAddress: string
  worker?: Worker

  initWorker (workerAddress: string): Promise<void>

  createWorkerFromXMLHttpRequest (workerAddress: string): Promise<Worker>

  do (data: ArrayBuffer): Promise<Object>
}
