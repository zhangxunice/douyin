function uploadVideo() {
  var that = this
  wx.chooseVideo({
    sourceType: ['album'],
    success(res) {

      var duration = res.duration
      var height = res.height
      var width = res.width
      var tempFilePath = res.tempFilePath
      var thumbTempFilePath = res.thumbTempFilePath

      //做上传视频长度限制
      //TODO

      wx.navigateTo({
        url: '../chooseBgm/chooseBgm?duration=' + duration +
          '&height=' + height +
          '&width=' + width +
          '&tempFilePath=' + tempFilePath +
          '&thumbTempFilePath=' + thumbTempFilePath,
      })
    }
  })
}

module.exports={
  uploadVideo: uploadVideo
}