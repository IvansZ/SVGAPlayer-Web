/// <reference path="../../types/vendor.d.ts" />

import { Root } from 'protobufjs'
import svgaFileDataDescriptor from '../common/svga-file-data-descriptor'
import { Zlib } from 'zlibjs/bin/inflate.min.js'
import u8aToString from './u8a-to-string'
import VideoEntity from './video-entity'

declare var self: Worker

const proto = Root.fromJSON(svgaFileDataDescriptor)
const message = proto.lookupType('com.opensource.svga.MovieEntity')

self.onmessage = function (event) {
  const inflateData: Uint8Array = (new Zlib.Inflate(new Uint8Array(event.data))).decompress()

  const movie: any = message.decode(inflateData)

  const images: { [key: string]: string } = {}

  for (let key in movie.images) {
    const element = movie.images[key]

    const value = u8aToString(element)

    images[key] = btoa(value)
  }

  self.postMessage(new VideoEntity(movie, images))
}
