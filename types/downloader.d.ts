interface Downloader {
  svgaResourceAddress: string

  constructor (svgaResourceAddress: string): Downloader

  request (): Promise<ArrayBuffer>
}
