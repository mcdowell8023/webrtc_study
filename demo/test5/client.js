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

// 抓取桌面
function shareDesktop() {
  // 只有在 PC 下才能抓取桌面
  // if (IsPC()) {
  // 开始捕获桌面数据
  navigator.mediaDevices
    .getDisplayMedia({ video: true })
    .then(gotMediaStream)
    .catch(handleError)

  return true
  // }

  return false
}

shareDesktop()
