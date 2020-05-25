'use strict'

// 获取 HTML 页面中的 video 标签
var videoplay = document.querySelector('video#player')

// 播放视频流
function gotMediaStream(stream) {
  videoplay.srcObject = stream
}

function handleError(err) {
  console.log('getUserMedia error:', err)
}

// 对采集的数据做一些限制
var constraints = {
  video: {
    width: 1280,
    height: 720,
    frameRate: 15,
  },
  audio: false,
}

// 采集音视频数据流
navigator.mediaDevices
  .getUserMedia(constraints)
  .then(gotMediaStream)
  .catch(handleError)
