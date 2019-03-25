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

## 差异

* 不支持 v1.x 格式
* 不支持声音播放

## 安装

### NPM

```sh
yarn add svga.lite

# 或者

npm i svga.lite
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/svga.lite/dist/svga.lite.min.js"></script>
```

## 简单使用

```html
<canvas id="canvas"></canvas>
```

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

## Player.set({ 参数 })

属性名 |  说明 | 类型 | 默认值 | 备注
-|-|-|-|-
loop | 循环次数 | `number` | `0` | 设置为 `0` 时，循环播放
fillMode | 最后停留的目标模式 | `forwards` `backwards` | `forwards` | 类似于 [css animation-fill-mode](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-fill-mode)
playMode | 播放模式 | `forwards` `fallbacks` | `forwards` |
startFrame | 开始播放帧 | `number` | `0` |
endFrame | 结束播放帧 | `number` | `0` | 设置为 `0` 时，默认为 SVGA 文件最后一帧

## 动态元素

你能够通过改变 svga data 对应键值的元素，从而达到动态元素的效果。

```js
import { Downloader, Parser, Player } from 'svga.lite'

const downloader = new Downloader()
const parser = new Parser()
const player = new Player('#canvas')

;(async () => {
  const fileData = await downloader.get('./xxx.svga')
  const svgaData = await parser.do(fileData)

  const image = new Image()
  image.src = 'https://xxx.com/xxx.png'
  svgaData.images['key'] = image

  await player.mount(svgaData)

  player.start()
})()
```

## 可复用实例化 Downloader & Parser

```js
import { Downloader, Parser, Player } from 'svga.lite'

const downloader = new Downloader()
const parser = new Parser()

const player1 = new Player('#canvas1')
const player2 = new Player('#canvas2')

const fileData1 = await downloader.get('./1.svga')
const fileData2 = await downloader.get('./2.svga')

const svgaData1 = await parser.do(fileData1)
const svgaData2 = await parser.do(fileData2)

await player1.mount(svgaData1)
await player2.mount(svgaData2)

player1.start()
player2.start()
```

## LICENSE

[MIT](./LICENSE)
