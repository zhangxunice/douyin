const app = getApp()

Page({
  data: {
    params: {}
  },

  upload: function(e) {
    var serverUrl = app.serverUrl
    var userInfo = app.getGlobalInfo()
    var bgmId = e.detail.value.bgmId
    var desc = e.detail.value.desc

    var duration = this.data.params.duration
    var height = this.data.params.height
    var width = this.data.params.width
    var tempFilePath = this.data.params.tempFilePath
    var thumbTempFilePath = this.data.params.thumbTempFilePath

    wx.showLoading({
      title: '上传中...',
    })
    wx.uploadFile({
      url: serverUrl + '/video/uploadVideo', //仅为示例，非真实的接口地址
      filePath: tempFilePath,
      name: 'multipartFiles',
      formData: {
        userId: userInfo.id,
        bgmId: bgmId,
        videoSecond: duration,
        videoHeight: height,
        videoWidth: width,
        desc: desc
      },
      success: (res) => {
        const data = JSON.parse(res.data)
        console.log(res)
        wx.hideLoading()
        var status = data.status.toString()
        // var videoId = res.data.data
        if (status.startsWith('2')) {
          wx.showToast({
            title: '上传成功',
            icon: 'none',
            duration: 2000
          })
          wx.navigateBack({
            delta: 1
          })

          // wx.uploadFile({
          //   url: serverUrl + '/video/uploadCover', //仅为示例，非真实的接口地址
          //   filePath: thumbTempFilePath,
          //   name: 'multipartFiles',
          //   formData: {
          //     userId: app.userInfo.id,
          //     videoId: videoId
          //   },
          //   success: (res) => {
          //     const data = JSON.parse(res.data)
          //     var status = data.status.toString()
          //     if (status.startsWith('2')) {
          //       wx.showToast({
          //         title: '上传成功',
          //         icon: 'success',
          //         duration: 2000
          //       })
          //       wx.navigateBack({
          //         delta:1
          //       })
          //     } else {
          //       wx.showToast({
          //         title: '上传失败',
          //         icon: 'none',
          //         duration: 2000
          //       })


          //     }
          //   }
          // })



        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  onLoad: function(params) {
    console.log(params)
    var serverUrl = app.serverUrl

    this.setData({
      params: params,
      serverUrl: serverUrl
    })

    wx.request({
      url: serverUrl + '/bgm/bgmlist', //仅为示例，并非真实的接口地址
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        console.log(res.data)
        var bgmList = res.data.data
        this.setData({
          bgmList: bgmList
        })
      }
    })

  },


})