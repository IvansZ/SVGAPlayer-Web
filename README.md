# SVGA.Lite

This is a SVGA player on the Web, and its goal is to be lighter and more efficient, But at the same time it also gave up compatibility support for some older browsers.

[简体中文](./README.zh-CN.md)

## Target Future

- [x] Size = 80kb (gzip = 27kb)
- [x] Compatible Android 4+ / iOS 9+
- [x] Better Asynchronous Operation
- [x] Multi-threaded (WebWorker) parsing file data

## Experimental

- [ ] Use WebAssembly instead of WebWorker
- [ ] Rendering engine simulation runs in the WebWorker
- [ ] GPU accelerated operation

## Diff

* not support v1.x format
* not support play sound

## Install

### NPM

```sh
yarn add svga.lite

# or

npm i svga.lite
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/svga.lite/dist/svga.lite.min.js"></script>
```

## Simple Use

```html
<canvas id="canvas"></canvas>
```

```js
import { Downloader, Parser, Player } from 'svga.lite'

const downloader = new Downloader()
const parser = new Parser()
const player = new Player('#canvas') // #canvas is HTMLCanvasElement

;(async () => {
  const fileData = await downloader.get('./xxx.svga')
  const svgaData = await parser.do(fileData)

  player.set({
    loop: 1,
    fillMode: 'forwards'
  })

  await player.mount(svgaData)

  player
    .$on('start', () => console.log('event start'))
    .$on('pause', () => console.log('event pause'))
    .$on('stop', () => console.log('event stop')
    .$on('end', () => console.log('event end'))
    .$on('clear', () => console.log('event clear'))
    .$on('process', () => console.log('event process', player.progress))

  player.start()
  // player.pause()
  // player.stop()
  // player.clear()
})()
```

## LICENSE

[MIT](./LICENSE)
