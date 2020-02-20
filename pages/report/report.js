const app = getApp()

Page({
    data: {
        reasonType: "请选择原因",
        reportReasonArray: app.reportReasonArray,
        publishUserId:"",
        videoId:""
    },

  changeMe:function(e){
    var index=e.detail.value
    var reasonType=app.reportReasonArray[index]
    this.setData({
      reasonType:reasonType
    })
  },

  submitReport:function(e){
    var reasonIndex = e.detail.value.reasonIndex
    var reasonContent = e.detail.value.reasonContent
    var userInfo = app.getGlobalInfo()
    var userId=userInfo.id
    var serverUrl=app.serverUrl

    if(reasonIndex==null||reasonIndex==''||reasonIndex==undefined){
      wx.showToast({
        title: '未选择理由',
        icon:'none'
      })
      return;
    }
    wx.request({
      url: serverUrl +'/user/reportuser',
      method:'POST',
      data:{
        dealUserId:this.data.publishUserId,
        dealVideoId:this.data.videoId,
        title: app.reportReasonArray[reasonIndex] ,
        content: reasonContent,
        userid:userId
      },
      success:(res)=>{
        wx.showToast({
          title: res.data.data,
          icon:'sucess',
          duration:2000,
          success:function(){
            wx.navigateBack({})
          }
        })
      }
    })
  },

    onLoad:function(params) {
      var publishUserId = params.publishId
      var videoId=params.videoId
      this.setData({
        publishUserId:publishUserId,
        videoId:videoId
      })
    },

   

    
    
})
