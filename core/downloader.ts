export default class Downloader implements Downloader {
  public svgaResourceAddress: string = ''

  constructor (svgaResourceAddress: string) {
    this.svgaResourceAddress = svgaResourceAddress
  }

  request () {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()

      request.open('GET', this.svgaResourceAddress, true)

      request.responseType = 'arraybuffer'

      request.onloadend = () => resolve(request.response)
      request.onerror = () => reject(request.response)

      request.send()
    })
  }
}
