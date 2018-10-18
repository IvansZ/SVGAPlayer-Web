# SVGA.Lite

这是一个 SVGA 在 Web 上的播放器，它的目标是更轻量级、更高效，但同时它也放弃了对一些旧版本浏览器的兼容性支持。

## 目标未来

- [x] 体积 < 80k
- [x] 兼容 Android 4+ / iOS 9+
- [x] 更好的异步操作
- [x] 多线程 (WebWorker/WebAssembly) 分析文件数据

## 实验性

- [ ] 渲染引擎模拟运行在 WebWorker
- [ ] GPU 加速运算

## 简单使用

```js
const { Downloader, Parser, Player } = SVGA

const downloader = new Downloader()
const parser = new Parser()
const player = new Player('#canvas')

;(async () => {
  const fileData = await downloader.request('./xxx.svga')
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
