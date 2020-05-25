# 音视频采集

## 进行 录制

- **服务端录制**：

  - 优点：不用担心客户因自身电脑问题造成录制失败（如磁盘空间不足），也不会因录制时抢占资源（CPU 占用率过高）而导致其他应用出现问题等；
  - 缺点：**实现的复杂度很高**，画质远不如本地录制

- **客户端录制**：
  - 优点：**方便录制方操控，并且所录制的视频清晰度高，实现相对简单**。【这里可以和服务端录制做个对比，一般客户端摄像头的分辨率都非常高的（如 1280x720），所以客户端录制可以录制出非常清晰的视频；但服务端录制要做到这点就很困难了，本地高清的视频在上传服务端时由于网络带宽不足，视频的分辨率很有可能会被自动缩小到了 640x360，这就导致用户回看时视频特别模糊，用户体验差。】 -缺点： 客户端在进行录制时会开启第二路编码器，这样会特别耗 CPU。而 CPU 占用过高后，就很容易造成应用程序卡死。除此之外，它对内存、硬盘的要求也特别高，所以**录制失败率高**。

> 服务端录制的相关知识，由于与 WebRTC 库无关

### 基础知识

### ArrayBuffer

ArrayBuffer 对象表示通用的、固定长度的二进制数据缓冲区。因此，你可以直接使用它存储图片、视频等内容。但并不能直接访问。

ArrayBuffer 只是描述有这样一块空间可以用来存放二进制数据，但在计算机的内存中并没有真正地为其分配空间。只有当具体类型化后，它才真正地存在于内存中。

### ArrayBufferView

ArrayBufferView 指的是 Int8Array、Uint8Array、DataView 等类型的总称，而这些类型都是使用 ArrayBuffer 类实现的

    ArrayBufferView 并不是一个具体的类型，而是代表不同类型的 Array 的描述。这些类型包括：Int8Array、Uint8Array、DataView 等。也就是说 Int8Array、Uint8Array 等才是 JavaScript 在内存中真正可以分配的对象。

    以 Int8Array 为例，当你对其实例化时，计算机就会在内存中为其分配一块空间，在该空间中的每一个元素都是 8 位的整数。再以 Uint8Array 为例，它表达的是在内存中分配一块每个元素大小为 8 位的无符号整数的空间。

> 相同位数的有符号位比无符号位能表示的数减半 【最高位要用 来表示符号】

### Blob

由 ArrayBuffer 对象的封装类实现的，即 Int8Array、Uint8Array 等类型

```js
var aBlob = new Blob(array, options)
// array 可以是ArrayBuffer、ArrayBufferView、Blob、DOMString等类型 ；option，用于指定存储成的媒体类型。
```

> WebRTC 录制音视频流之后，最终是通过 Blob 对象将数据保存成多媒体文件的

## 录制本地音视频

[MediaRecorder MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaRecorder)

`var mediaRecorder = new MediaRecorder(stream[, options]);`

- stream，通过 getUserMedia 获取的本地视频流或通过 RTCPeerConnection 获取的远程视频流。
- options，可选项，指定视频格式、编解码器、码率等相关信息，如 mimeType: 'video/webm;codecs=vp8'。

> MediaRecorder 对象还有一个特别重要的事件，即 ondataavailable 事件。当 MediaRecoder 捕获到数据时就会触发该事件。通过它，我们才能将音视频数据录制下来

### 步骤

1. 判断兼容性 `MediaRecorder.isTypeSupported({mimeType: 'video/webm;codecs=vp8'})`
2. 使用 new MediaRecorder(stream, options)
3. 添加 `MediaRecorder.ondataavailable = function(e){}`事件监听,在事件监听中 存储 录制数据`buffer.push(e.data);`
4. 开始录制`mediaRecorder.start(timeslice);`,通过给 timeslice 参数设置一个毫秒值,如果设置这个毫秒值,那么录制的媒体会按照你设置的值进行分割成一个个单独的区块, 而不是以默认的方式录制一个非常大的整块内容.【这是 timeslice 可以有效避免 错误发生几率】
5. 播放和下载 ,都需要 借助`new Blob(buffer, {type: 'video/webm'});`和`window.URL.createObjectURL(blob)`获取地址，进行播放下载

> 于大多数采用客户端录制方案的公司，在录制时一般不是录制音视频数据，而是录制桌面加音频，这样就大大简化了客户端实现录制的复杂度了。我想你也一定知道这是为什么，没错就是因为在桌面上有其他参与人的视频，所以只要将桌面录制下来，所有的视频就一同被录制下来了
