/// <reference path="../types/pako.d.ts" />

import * as pakoInflate from 'pako/lib/inflate'
import { Root } from 'protobufjs'
import svgaFileDataDescriptor from './common/svga-file-data-descriptor'

declare var self: Worker

const proto = Root.fromJSON(svgaFileDataDescriptor)
const message = proto.lookupType('com.opensource.svga.MovieEntity')

const Uint8ToString = (u8a: Uint8Array): string => {
  const CHUNK_SZ = 0x8000

  const changeArray = []

  for (let i = 0; i < u8a.length; i += CHUNK_SZ) {
    changeArray.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)))
  }

  return changeArray.join('')
}

self.onmessage = function (event) {
  const inflateData: Uint8Array = pakoInflate.inflate(new Uint8Array(event.data))

  const movie: any = message.decode(inflateData)

  const images: { [key: string]: string } = {}

  for (let key in movie.images) {
    const element = movie.images[key]

    const value = Uint8ToString(element)

    images[key] = btoa(value)
  }

  self.postMessage({ movie, images })
}
