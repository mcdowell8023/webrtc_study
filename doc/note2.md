# 获取音视频设备

> 在第一章，说过 webrtc 通信前，要进行设备检测，才可以采集、录制

## 音视频设备的基本原理

> 摘自 李超 - 从 0 打造音视频直播系统

1. 音频设备
   音频有采样率和采样大小的概念，实际上这两个概念就与音频设备密不可分。

- 音频输入设备的主要工作是采集音频数据，而采集音频数据的本质就是模数转换（A/D），即将模似信号转换成数字信号。

- 模数转换使用的采集定理称为奈奎斯特定理，其内容如下：

  > 在进行模拟 / 数字信号的转换过程中，当采样率大于信号中最高频率的 2 倍时，采样之后的数字信号就完整地保留了原始信号中的信息。

- 人类听觉范围的频率是 20Hz ～ 20kHz 之间。对于日常语音交流（像电话），8kHz 采样率就可以满足人们的需求。但为了追求高品质、高保真，你需要将音频输入设备的采样率设置在 40kHz 以上，这样才能完整地将原始信号保留下来。例如我们平时听的数字音乐，一般其采样率都是 44.1k、48k 等，以确保其音质的无损。

- 采集到的数据再经过量化、编码，最终形成数字信号，这就是音频设备所要完成的工作。在量化和编码的过程中，采样大小（保存每个采样的二进制位个数）决定了每个采样最大可以表示的范围。如果采样大小是 8 位，则它表示的最大值是就是 2^8 -1，即 255；如果是 16 位，则其表示的最大数值是 65535。

2. 视频设备

- 至于视频设备，则与音频输入设备很类似。当实物光通过镜头进行到摄像机后，它会通过视频设备的模数转换（A/D）模块，即光学传感器， 将光转换成数字信号，即 RGB（Red、Green、Blue）数据。

- 获得 RGB 数据后，还要通过 DSP（Digital Signal Processer）进行优化处理，如自动增强、白平衡、色彩饱和等都属于这一阶段要做的事情。

- 通过 DSP 优化处理后，你就得到了 24 位的真彩色图片。因为每一种颜色由 8 位组成，而一个像素由 RGB 三种颜色构成，所以一个像素就需要用 24 位表示，故称之为 24 位真彩色。

- 另外，此时获得的 RGB 图像只是临时数据。因最终的图像数据还要进行压缩、传输，而编码器一般使用的输入格式为 YUV I420，所以在摄像头内部还有一个专门的模块用于将 RGB 图像转为 YUV 格式的图像。

- 那什么是 YUV 呢？YUV 也是一种色彩编码方法，主要用于电视系统以及模拟视频领域。它将亮度信息（Y）与色彩信息（UV）分离，即使没有 UV 信息一样可以显示完整的图像，只不过是黑白的，这样的设计很好地解决了彩色电视机与黑白电视的兼容问题。

通过上面的讲解，现在你应该对音频设备与视频设备都有一个基本的认知了。

## 获取媒体设备

### MediaDevices.enumerateDevices

> 请求一个可用的媒体输入和输出设备的列表，例如麦克风，摄像机，耳机设备等。 返回的 Promise 完成时，会带有一个描述设备的 MediaDeviceInfo 的数组。
> [MediaDevices.enumerateDevices MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/enumerateDevices)

#### 示例

```js
// 兼容 判断是否支持
if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
  console.log('不支持 enumerateDevices() .')
  return
}

// 列出相机和麦克风。

navigator.mediaDevices
  .enumerateDevices()
  .then(function (MediaDeviceInfos) {
    MediaDeviceInfos.forEach(function (device) {
      console.log(
        device.kind + ': ' + device.label + ' id = ' + device.deviceId
      )
    })
  })
  .catch(function (err) {
    console.log(err.name + ': ' + err.message)
  })
```

#### MediaDeviceInfo

它表示的是每个输入 / 输出设备的信息。包含以下三个重要的属性：

- deviceID，设备的唯一标识；
- label，设备名称；
- kind，设备种类，可用于识别出是音频设备还是视频设备，是输入设备还是输出设备。

> 1.  出于安全原因，除非用户已被授予访问媒体设备的权限（要想授予权限需要使用 HTTPS 请求），否则 label 字段始终为空。
> 2.  label 可以用作指纹识别机制的一部分，以识别是否是合法用户

#### InputDeviceInfo

- MediaDeviceInfo 表是所有设备信息，
- InputDeviceInfo 表式输入设备信息，
- MediaDeviceInfo 包含 InputDeviceInfo。

## 设备检测

1. 通过 MediaDeviceInfo 结构中的 kind 字段，将设备分类为音频设备或视频设备。
2. 通过 kind 字段再将音视设备分为输入设备和输出设备
3. 对于区分出的音频设备和视频设备，每种不同种类的设备还会设置各自的默认设备。
4. 不指定某个具体设备 直接使用 MediaDevices.getUserMedia API 来采集音视频数据时，它就会从设备列表中的默认设备上采集数据。

### 设备检测思路

如果我们能从指定的设备上采集到音视频数据，那说明这个设备就是有效的设备。

所以，对每个设备都一项一项进行检测，即先排查视频设备，然后再排查音频设备。因此，需要调用两次 MediaDevices.getUserMedia API 进行设备检测。

> 第一次，调用 getUserMedia API 只采集视频数据并将其展示出来。如果用户能看到自己的视频，说明视频设备是有效的；否则，设备无效，可以再次选择不同的视频设备进行重新检测。

> 第二次，如果用户视频检测通过了，再次调用 getUserMedia API 时，则只采集音频数据。由于音频数据不能直接展示，所以需要使用 JavaScript 中的 AudioContext 对象，将采集到的音频计算后，再将其绘制到页面上。这样，当用户看到音频数值的变化后，说明音频设备也是有效的。

#### 关于设备检测

我做了个实验，找一个损坏的麦克风，插入电脑，发现仍然可以 通过 mediaDevices.enumerateDevices 枚举得到这个麦克风，
