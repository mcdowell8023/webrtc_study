/*
 * @Author: mcdowell
 * @Date: 2020-05-08 10:47:27
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-10 21:16:52
 */
/* 借助 vue 编写 测试页面 */
var vm = new Vue({
  el: '#app',
  data: {
    deviceJson: null,
    current: {
      audio: '',
      video: '',
    },
    deviceArr: [],
  },
  methods: {
    changePlayer: async function (e) {
      const mediaStreamContrains = {
        video:
          this.current && this.current.video
            ? { deviceId: this.current.video }
            : true,
        audio:
          this.current && this.current.audio
            ? { deviceId: this.current.audio }
            : true,
      }
      console.log(
        mediaStreamContrains,
        'mediaStreamContrains',
        this.current.audio,
        'this.current.audio'
      )
      // 显示 切换后的设备
      const res = await testDevices(mediaStreamContrains)
      this.deviceArr = res.map(
        (item) => `${item.kind}:${item.label}-${item.id}`
      )
      console.log(res, '切换后')
    },
    select: function (e, { deviceType, type }) {
      id = e.target.value
      if (deviceType === 'input') {
        this.current[type] = id
      }
    },

    async init() {
      //读取设备列表
      const deviceJson = await getMediaDevices()
      console.log(deviceJson, 'deviceJson---设备列表')
      this.deviceJson = deviceJson

      // 显示 切换后的设备
      const res = await testDevices({ video: true, audio: true })
      console.log(res, 'testDevices-设备播放')
      if (res) {
        this.deviceArr = res.map(
          (item) => `${item.kind}:${item.label}-${item.id}`
        )
      }
    },
  },
  created: function () {
    console.log('mounted')
    // 兼容 判断是否支持
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log('不支持 enumerateDevices() .')
      // return false
    }

    this.init()
  },
})

// 设备 分类
// {kind,deviceId,groupId,label}
function formatMediaDevices(arr) {
  const josn = { input: null, output: null }
  arr.map((item) => {
    // 输入还是输出
    const type = item.kind.replace('audio', '').replace('video', '')
    // 音频 还是 视频
    const key = item.kind.replace('input', '').replace('output', '')
    // 分组分类 扔进 json
    if (josn[type] && josn[type][key]) {
      josn[type][key].push(item)
    } else {
      josn[type] = { ...josn[type] }
      josn[type][key] = [item]
    }
  })
  return josn
}

async function getMediaDevices() {
  var MediaDevices = navigator.mediaDevices
  // 获取 设备
  try {
    const res = await MediaDevices.enumerateDevices()
    // 获取输入设备
    const deviceJson = formatMediaDevices(res)
    return deviceJson
    //
  } catch (err) {
    console.log('获取设备失败，' + err.name + ': ' + err.message)
  }
}

async function testDevices(mediaStreamContrains) {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia(
      mediaStreamContrains
    )

    // 播放视频
    const localVideo = document.querySelector('video')
    localVideo.srcObject = mediaStream
    // 获得当前正在使用的设备
    const currentDevices = mediaStream.getTracks()
    return currentDevices
  } catch (error) {
    // DOMException: Permission denied 权限被拒绝
    if (error.toString().indexOf('Permission denied') > -1) {
      alert('请确保您是否有允许使用麦克风、摄像头')
    }

    console.log(error, '报错：')
  }
}
