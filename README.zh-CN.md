# SVGA.Lite

这是一个 SVGA 在 Web 上的播放器，它的目标是更轻量级、更高效，但同时它也放弃了对一些旧版本浏览器的兼容性支持。

## 目标未来

- [x] 体积 = 80k (gzip = 27kb)
- [x] 兼容 Android 4+ / iOS 9+
- [x] 更好的异步操作
- [x] 多线程 (WebWorker) 解析文件数据

## 实验性

- [ ] 使用 WebAssembly 替代 WebWorker
- [ ] 渲染引擎模拟运行在 WebWorker
- [ ] GPU 加速运算

## 安装

### NPM

```sh
npm i svga.lite

# or

yarn add svga.lite
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/svga.lite/dist/svga.lite.min.js"></script>
```

## 简单使用

```js
import { Downloader, Parser, Player } from 'svga.lite'

const downloader = new Downloader()
const parser = new Parser()
const player = new Player('#canvas') // #canvas 是 HTMLCanvasElement

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
