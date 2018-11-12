export default class Downloader implements Downloader {
  get (svgaResourceLink: string) {
    if (!svgaResourceLink) {
      throw new Error('download link undefined')
    }

    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()

      request.open('GET', svgaResourceLink, true)

      request.responseType = 'arraybuffer'

      request.onloadend = () => resolve(request.response)
      request.onerror = () => reject(request.response)

      request.send()
    })
  }
}
