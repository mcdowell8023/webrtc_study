# 基础知识

## webretc 实现过程基本概况

### webretc1 对 1 音视频实时通话

![](/image/webretc1对1音视频实时通话的过程图.png)

这幅图从大的方面可以分为 4 部分:

- 两个 WebRTC 终端（上图中的两个大方框）
  - WebRTC 终端，负责音视频采集、编解码、NAT 穿越、音视频数据传输
- 一个 Signal（信令）服务器
  - Signal 服务器，负责信令处理，如加入房间、离开房间、媒体协商消息的传递等
- 一个 STUN/TURN 服务器
  - STUN/TURN 服务器，负责获取 WebRTC 终端在公网的 IP 地址，以及 NAT 穿越失败后的数据中转

#### WebRTC 进行音视频通话的大体过程

1. WebRTC 终端 A 进入房间之前，它首先会检测自己的设备是否可用。如果此时设备可用，则进行**音视频数据采集**
2. 采集到的数据一方面可以做预览，也就是让自己可以看到自己的视频；另一方面，可以将其录制下来保存成文件，等到视频通话结束后，上传到服务器让用户回看之前的内容
3. 在获取音视频数据就绪后，WebRTC 终端 A 要发送 “加入” 信令到 Signal 服务器。
4. Signal 服务器收到该消息后会创建房间。在另外一端 WebRTC 终端 B，也要做同样的事情，只不过它不是创建房间，而是加入房间了。待 WebRTC 终端 B 成功加入房间后，第一个用户会收到 “另一个用户已经加入成功” 的消息。
5. 此时，WebRTC 终端 A 将创建 “媒体连接” 对象（RTCPeerConnection），并将采集到的音视频数据通过 RTCPeerConnection 对象进行编码，最终通过 P2P 传送给对端 WebRTC 终端 B
6. 当然，在进行 P2P 穿越时很有可能失败。所以，当 P2P 穿越失败时，为了保障音视频数据仍然可以互通，则需要通过 TURN 服务器 进行音视频数据中转
7. 当 音视频数据 “历尽千辛万苦” 来到对端后，对端首先 将收到的音视频数据进行解码，最后再将其展示出来，这样就完成了一端到另一端的单通。 如果双方要互通，那么，两方都要通过 RTCPeerConnection 对象传输自己一端的数据，并从另一端接收数据。

以上，就是这幅图大体所描述的含义。

## 音视频采集

### 基本概念

- 摄像头 ~~
- 帧率：
  > 摄像头一秒钟采集图像的次数称为帧率【帧率越高，视频就越平滑流畅。然而，在直播系统中一般不会设置太高的帧率，因为帧率越高，占的网络带宽就越多。】
- 分辨率：
  > 摄像头除了可以设置帧率之外，还可以调整分辨率。如 2K、1080pp、720p 等等。分辨率越高图像就越清晰，但同时也带来一个问题，即占用的带宽也就越多 【通常 分辨率会跟据你的网络带宽进行动态调整 】
- 宽高比
  > 分辨率一般分为两种宽高比，即 16:9 或 4:3【4:3 是从黑白电视来的，现在通常是 16:9】
- 麦克风：
  > 用于采集音频数据。可以指定一秒内采样的次数，称为采样率。每个采样用几个 bit 表示，称为采样位深或采样大小。
- 轨（Track）：
  > 借鉴了多媒体的概念，在多媒体中表达的就是每条轨数据都是独立的，不会与其他轨相交。【像火车轨一样，用不相交】如 MP4 中的音频轨、视频轨，它们在 MP4 文件中是被分别存储的。
- 流（Stream）：
  > 可以理解为容器。在 WebRTC 中，“流”可以分为媒体流（MediaStream）和数据流（DataStream）。
  >
  > - 媒体流可以存放 0 个或多个音频轨或视频轨；
  > - 数据流可以存 0 个或多个数据轨。

### 音视频采集

#### navigator.mediaDevices.getUserMedia

> 在用户通过提示允许的情况下，打开系统上的相机或屏幕共享和/或麦克风，并提供 MediaStream 包含视频轨道和/或音频轨道的输入。 [MediaDevices MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices)
> 返回一个 promise 对象【对没错使用 .then().catch()】

```js
const mediaStreamContrains = {
  video: true,
  audio: true,
}
navigator.mediaDevices
  .getUserMedia(mediaStreamContrains)
  .then((mediaStream) => {
    // mediaStream 即时返回的 媒体流 通常喂给 video.srcObject
    // do something
  })
  .catch((error) => {
    console.log('navigator.getUserMedia error: ', error)
  })
//
```

##### mediaStreamContraints

> 用于 约束 navigator.mediaDevices.getUserMedia() 返回的 MediaStream 的参数
> 主要接收两个参数 {video: true, audio: true} # video、audio 不写默认 都是 false 你就拿不到音频轨、视频轨
> [mediastreamconstraints w3c](https://w3c.github.io/mediacapture-main/getusermedia.html#mediastreamconstraints)

当然 video、audio 属性可以接收具体 参数,例如：

```js
const mediaStreamContrains = {
  video: {
    frameRate: { min: 20 }, // 帧率最小 20 帧每秒 根据不同硬件， 参数过大可能导致 错误
    width: { min: 640, ideal: 1280 }, // 宽度最小是 640，理想的宽度是 1280
    height: { min: 360, ideal: 720 }, // 高度最小是 360，最理想高度是 720
    aspectRatio: 16 / 9, // 宽高比是 16:9
  },
  audio: {
    echoCancellation: true, //回声消除
    noiseSuppression: true, // 噪音抑制
    autoGainControl: true, //自动控制
  },
}
```

详细参数：

| 参数             | 含义                                                                               | 备注                                                                           |
| ---------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| width            | 视频宽度                                                                           |                                                                                |
| height           | 视频高度                                                                           |                                                                                |
| aspectRatio      | 视频宽高比                                                                         |                                                                                |
| frameRate        | 帧率                                                                               |                                                                                |
| facingMode       | user:前置摄像头；enviroment:后置摄像头 ；left:前置左侧摄像头；right:前置右侧摄像头 | enum VideoFaciongModeEnum{user,enviroment,left,right}                          |
| resizeMode       | 是否允许调整图像大小                                                               |                                                                                |
| volume           | 音量大小                                                                           |                                                                                |
| sampleRate       | 音频采样率                                                                         |                                                                                |
| sampleSize       | 音频采样率大小                                                                     |                                                                                |
| echoCancellation | 是否开启回音消除                                                                   |                                                                                |
| autoGainControl  | 是否开启自动增益                                                                   |                                                                                |
| noiseSuppression | 是否开启降噪                                                                       |                                                                                |
| latency          | 延迟大小                                                                           |                                                                                |
| channalCount     | 声道数                                                                             |                                                                                |
| deviceID         | 设备 ID                                                                            | 指定哪个输入/输出设备                                                          |
| groupID          | 设置组 ID                                                                          | 如果两个设备属于同一物理设备，则他们具有相同的 groupID。比如有麦克风功能的手机 |

##### MediaStream

> 关于返回值 MediaStream 是一个媒体内容的流。一个流包含几个轨道，比如视频和音频轨道。
> [MediaStream MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStream)

> srcObject:
> 是 HTMLMediaElement 元素（这里主要是 video） 用于接收 file blob MediaStream 的属性 或者给出一个 mediaStream 返回值

关于一些说明：

- rtmp 的直播解决方案和 webRTC 之间优劣势在什么地方？

  - Rtmp 底层用的 tcp,wenrtc 底层主要使用 udp,使用 tcp 就注定他在极端网络情况下没法实时通信

- NAT 穿越是啥？
  - P2P，端与端直接进行连接，不需要服务器中转数据，这样可以节省服务器带宽，但并不意味着不需要服务器，服务器作为辅助功能

* navigator.mediaDevices 报错不存在【错误信息：navigator.getUserMedia is not a function】
  - 出于安全的原因，你只能用 localhost 访问或 https 访问时才能检测到 mediaDevice
