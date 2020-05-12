/*
 * @Author: mcdowell
 * @Date: 2020-05-07 13:30:36
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-07 16:27:11
 */
'use strict'

// MediaStreamConstraints 限制 参数
// const mediaStreamContrains = {
//   video: true,
//   // audio: true,
// }
const mediaStreamContrains = {
  video: {
    // resizeMode: true,

    // deviceID:
    //   '3795d437c09b4f82d73d3915a968f1f32677f32edff3b37e4cc09d0a01d915e3',
    frameRate: { min: 20 }, // 帧率最小 20 帧每秒
    width: { min: 640, ideal: 1280 }, // 宽度最小是 640，理想的宽度是 1280
    height: { min: 360, ideal: 720 }, // 高度最小是 360，最理想高度是 720
    aspectRatio: 16 / 9, // 宽高比是 16:9
  },
  audio: true,
  audio: {
    deviceID:
      '24e92012c5df17e75791e062a9083b7e79a53fb6ad9530adfaaf4528d43549a2',
    // echoCancellation: true, //回声消除
    // noiseSuppression: true, // 噪音抑制
    // autoGainControl: true, //自动控制
  },
}
const localVideo = document.querySelector('video')

function gotLocalMediaStream(mediaStream) {
  // srcObject 是 HTMLMediaElement 元素（这里主要是 video） 用于接收 file blob  MediaStream 的属性
  // 者给出一个 mediaStream返回值
  localVideo.srcObject = mediaStream
  console.log(localVideo.srcObject, 'localVideo.srcObject')
}

function handleLocalMediaStreamError(error) {
  console.log('navigator.getUserMedia error: ', error)
}

// 获取 媒体流
navigator.mediaDevices
  .getUserMedia(mediaStreamContrains)
  .then(gotLocalMediaStream)
  .catch(handleLocalMediaStreamError)

// 获取 媒体设备信息 返回 promise 对象
navigator.mediaDevices
  .enumerateDevices()
  .then((res) => {
    console.log('MediaDevices.enumerateDevices()', res)
  })
  .catch((error) => {
    console.log('navigator.enumerateDevices error: ', error)
  })
