interface Parser {
  workerAddress: string
  worker?: Worker

  constructor (workerAddress: string): Parser

  do (data: ArrayBuffer): Promise<Object>
}
