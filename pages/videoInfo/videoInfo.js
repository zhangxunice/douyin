// pages/videoInfo/videoInfo.js
var videoUtil = require('../../utils/videoUtils.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cover: "cover",
    src: "",
    videoInfo: {},
    videoId: "",
    serverUrl:app.serverUrl,
    userLikeVideo: false,
    commentsPage: 1,
    commentsTotalPage: 1,
    commentsList: [],
    placeholder:'说点什么...'
  },

  videoCtx: {},

  showSearch: function() {
    wx.navigateTo({
      url: '../searchVideo/searchVideo',
    })
  },

  upload: function() {
    videoUtil.uploadVideo()
  },

  likeVideoOrNot: function() {
    var user = app.getGlobalInfo()
    var video = this.data.videoInfo
    var serverUrl = app.serverUrl

    if (user == null || user == undefined || user == '') {
      wx.navigateTo({
        url: '../user/login/login',
      })
    } else {
      var userLike = this.data.userLikeVideo
      var url = "/video/userLike?userId=" + user.id + "&videoId=" + video.id +
        "&videoCreaterId=" + video.userId

      wx.showLoading({
        title: '...',
      })

      if (userLike) {
        url = "/video/userUnLike?userId=" + user.id + "&videoId=" + video.id +
          "&videoCreaterId=" + video.userId
      }

      wx.request({
        url: serverUrl + url,
        method: 'POST',
        success: (res) => {
          wx.hideLoading()
          this.setData({
            userLikeVideo: !userLike
          })
        }
      })
    }
  },


  showPublisher: function() {
    var video = this.data.videoInfo
    
    wx.navigateTo({
      url: '../mine/mine?publisherId=' + video.userId,
    })
  },

  shareMe: function() {
    wx.showActionSheet({
      itemList: ['下载到本地', '举报视频', '分享到QQ', '分享到朋友圈', '分享到微博'],
      success: (res) => {

        if (res.tapIndex == 0) {
          //下载视频
          wx.showLoading({
            title: '下载中...',
          })
          wx.downloadFile({
            url: app.serverUrl + this.data.videoInfo.videoPath, //仅为示例，并非真实的资源
            success(res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode === 200) {
                console.log(res.tempFilePath)
                wx.saveVideoToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success(res) {
                    wx.hideLoading()
                  }
                })
              }
            }
          })
        } else {
          //举报视频
          var publishId = this.data.videoInfo.userId
          wx.navigateTo({
            url: '../report/report?videoId=' + this.data.videoId + '&publishId=' + publishId,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.videoCtx = wx.createVideoContext("myvideo", this)
    this.setData({
      serverUrl: app.serverUrl
    })

    var serverUrl = app.serverUrl
    var videoInfo = JSON.parse(options.videoInfo)
    var height = videoInfo.videoHeight
    var width = videoInfo.videoWidth
    var cover = 'cover'

    if (width > height) {
      cover: ''
    }

    this.setData({
      src: this.data.serverUrl + videoInfo.videoPath,
      videoId: videoInfo.id,
      videoInfo: videoInfo,
      cover: cover
    })

    var userInfo = app.getGlobalInfo()
    var userId = userInfo.id

    wx.request({
      url: serverUrl + '/user/queryPublisher?userId=' + userId + '&videoId=' + videoInfo.id + '&publisherId=' + videoInfo.userId,
      method: 'POST',
      success: (res) => {
        var publisher = res.data.data.users
        var userLikeVideo = res.data.data.userLikeVideo
        this.setData({
          userLikeVideo: userLikeVideo,
          publisher: publisher
        })
      }
    })

    this.getCommentsList(1)
    
  },

  showIndex: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  },

  showMine: function () {
    var user = app.getGlobalInfo();

    if (user == null || user == undefined || user == '') {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.navigateTo({
        url: '../mine/mine',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.videoCtx.play()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.videoCtx.pause()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var currentPage = this.data.commentsPage
    var totalPage = this.data.commentsTotalPage
    if (currentPage == totalPage) {
      return;
    }
    var page = currentPage + 1
    this.getCommentsList(page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  leaveComment: function() {
    this.setData({
      commentFocus: true
    })
  },

  replyFocus:function(e){
    var fatherCommentId = e.currentTarget.dataset.fathercommentid
    var toUserId = e.currentTarget.dataset.touserid
    var toNickname = e.currentTarget.dataset.tonickname

    this.setData({
      placeholder: "回复" + toNickname,
      replyFatherCommentId: fatherCommentId,
      replyToUserId: toUserId,
      commentFocus: true
    })
  },

  saveComment: function(e) {
    var content = e.detail.value
    var userInfo = app.getGlobalInfo()

//获取回复的replyFatherCommentId和replyToUserId
    var fatherCommentId = e.currentTarget.dataset.replyfathercommentid
    var toUserId = e.currentTarget.dataset.replytouserid

    wx.request({
      url: app.serverUrl + '/video/savecomment?fatherCommentId=' + fatherCommentId +'&toUserId='+toUserId,
      method: 'POST',
      data: {
        videoId: this.data.videoInfo.id,
        fromUserId: userInfo.id,
        comment: content
      },
      success: (res) => {
        this.getCommentsList(1)
        this.setData({
          contentValue: ''
        })
      }
    })
  },

  getCommentsList: function(page) {
    var videoId = this.data.videoId

    wx.request({
      url: app.serverUrl + '/video/getvideocomment?videoId=' + videoId + '&page=' + page,
      method: 'POST',
      success: (res) => {
        console.log(res.data)
        var commentsList = res.data.data.records
        var newCommentsList = this.data.commentsList
        this.setData({
          commentsList: newCommentsList.concat(commentsList),
          commentsPage: page,
          commentsTotalPage: res.data.data.pages,
        })
        
      }
    })
  }
})