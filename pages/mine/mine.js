// var videoUtil = require('../../utils/videoUtil.js')

const app = getApp()

Page({
  data: {
    serverUrl: app.serverUrl,
    isMe: true,
    isFollow: false,

    videoSelClass: "video-info",
    isSelectedWork: "video-info-selected",
    isSelectedLike: "",
    isSelectedFollow: "",
  },

  changeFace: function() {
    var serverUrl = app.serverUrl
    var userInfo = app.getGlobalInfo()
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)

        wx.showLoading({
          title: '上传中...',
        })
        wx.uploadFile({
          url: serverUrl + '/user/uploadFace?userId=' + userInfo.id, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            const data = JSON.parse(res.data)
            wx.hideLoading()
            wx.showToast({
                title: '上传成功',
                icon: 'successs',
                duration: 2000
              }),
              that.setData({
                faceUrl: serverUrl + data.data
              })

          }
        })


      }
    })
  },

  uploadVideo: function() {
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
  },

  followMe: function(e) {
    var pulisherId = this.data.pulisherId
    console.log(pulisherId)
    var userInfo = app.getGlobalInfo()
    var userId = userInfo.id
    var followType = e.currentTarget.dataset.followtype
    var url = ''

    //1:关注  0：取消关注
    if (followType == '1') {
      url = '/user/tobefans?userId=' + pulisherId + '&fansId=' + userId
    } else {
      url = '/user/unbefans?userId=' + pulisherId + '&fansId=' + userId
    }

    wx.showLoading({})
    wx.request({
      url: app.serverUrl + url,
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (followType == '1') {
          this.setData({
            isFollow: true
          })
        } else {
          this.setData({
            isFollow: false
          })
        }
      }
    })

  },

  doSelectWork: function() {
    this.setData({
      isSelectedWork: "video-info-selected",
      isSelectedLike: "",
      isSelectedFollow: "",
      myWorkFalg: false,
      myLikesFalg: true,
      myFollowFalg: true,

      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1
    })
    this.getMyVideoList(1);
  },
  doSelectLike: function() {
    this.setData({
      isSelectedWork: "",
      isSelectedLike: "video-info-selected",
      isSelectedFollow: "",

      myWorkFalg: true,
      myLikesFalg: false,
      myFollowFalg: true,

      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1
    })
    this.getMyLikesList(1);
  },

  doSelectFollow: function() {
    this.setData({
      isSelectedWork: "",
      isSelectedLike: "",
      isSelectedFollow: "video-info-selected",

      myWorkFalg: true,
      myLikesFalg: true,
      myFollowFalg: false,

      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1
    })
    this.getMyFollowList(1)
  },

  getMyVideoList:function(page){
    
    wx.showLoading({})
    var serverUrl=app.serverUrl
    wx.request({
      url: serverUrl +'/video/allVideos?page='+page,
      method:'POST',
      data:{
        userId:this.data.userId
      },
      success:(res)=>{
        var myVideoList = res.data.data.records
        wx.hideLoading()
        var newVideoList=this.data.myVideoList
        this.setData({
          myVideoPage:page,
          myVideoList:newVideoList.concat(myVideoList),
          myVideoTotal:res.data.data.pages,
          serverUrl:app.serverUrl
        })
      }
    })
  },

  getMyLikesList:function(page){
    var userId=this.data.userId
    wx.showLoading({})
    var serverUrl=app.serverUrl
    wx.request({
      url: serverUrl +'/video/showmylike?userId='+userId+'&page='+page,
      method:'POST',
      success:(res)=>{
        
        wx.hideLoading()
        var likeVideoList = res.data.data.records
        var newLikeVideo=this.data.likeVideoList
        this.setData({
          likeVideoPage:page,
          likeVideoList:newLikeVideo.concat(likeVideoList),
          likeVideoTotal:res.data.data.pages,
          serverUrl:app.serverUrl
        })
      }
    })
  },

  getMyFollowList:function(page){
    var userId=this.data.userId
    wx.showLoading({})
    var serverUrl=app.serverUrl
    wx.request({
      url: serverUrl +'/video/showmyfollow?userId='+userId+'&page='+page,
      method:'POST',
      success:(res)=>{
        wx.hideLoading()
        var followVideoList = res.data.data.records
        var newVideoList=this.data.followVideoList
        this.setData({
          followVideoPage:page,
          followVideoList:newVideoList.concat(followVideoList),
          followVideoTotal:res.data.data.pages,
          serverUrl:app.serverUrl
        })
      }
    })
  },

  // 点击跳转到视频详情页面
  showVideo: function (e) {


    var myWorkFalg = this.data.myWorkFalg;
    var myLikesFalg = this.data.myLikesFalg;
    var myFollowFalg = this.data.myFollowFalg;

    if (!myWorkFalg) {
      var videoList = this.data.myVideoList;
    } else if (!myLikesFalg) {
      var videoList = this.data.likeVideoList;
    } else if (!myFollowFalg) {
      var videoList = this.data.followVideoList;
    }

    var arrindex = e.target.dataset.arrindex;
    var videoInfo = JSON.stringify(videoList[arrindex]);

    wx.redirectTo({
      url: '../videoinfo/videoinfo?videoInfo=' + videoInfo
    })

  },

  // 到底部后触发加载
  onReachBottom: function () {
    var myWorkFalg = this.data.myWorkFalg;
    var myLikesFalg = this.data.myLikesFalg;
    var myFollowFalg = this.data.myFollowFalg;

    if (!myWorkFalg) {
      var currentPage = this.data.myVideoPage;
      var totalPage = this.data.myVideoTotal;
      // 获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if (currentPage === totalPage) {
        wx.showToast({
          title: '已经没有视频啦...',
          icon: "none"
        });
        return;
      }
      var page = currentPage + 1;
      this.getMyVideoList(page);
    } else if (!myLikesFalg) {
      var currentPage = this.data.likeVideoPage;
      var totalPage = this.data.myLikesTotal;
      // 获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if (currentPage === totalPage) {
        wx.showToast({
          title: '已经没有视频啦...',
          icon: "none"
        });
        return;
      }
      var page = currentPage + 1;
      this.getMyLikesList(page);
    } else if (!myFollowFalg) {
      var currentPage = this.data.followVideoPage;
      var totalPage = this.data.followVideoTotal;
      // 获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if (currentPage === totalPage) {
        wx.showToast({
          title: '已经没有视频啦...',
          icon: "none"
        });
        return;
      }
      var page = currentPage + 1;
      this.getMyFollowList(page);
    }

  },

  onLoad: function(params) {

    var pulisherId = params.publisherId
    var userInfo = app.getGlobalInfo()
    var userId = userInfo.id
    var serverUrl = app.serverUrl

    if (pulisherId != null && pulisherId != '' && pulisherId != undefined) {
      userId = pulisherId
      this.setData({
        isMe: false,
        pulisherId: pulisherId
      })
    }
    this.setData({
      userId:userId
    })

    wx.request({
      url: serverUrl + '/user/queryUser?userId=' + userId + '&fansId=' + userInfo.id,
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        console.log(res.data)
        this.setData({
          faceUrl: serverUrl + res.data.data.faceImage,
          fansCounts: res.data.data.fansCounts,
          username: res.data.data.username,
          followCounts: res.data.data.followCounts,
          receiveLikeCounts: res.data.data.receiveLikeCounts,
          isFollow: res.data.data.isFollow
        })
      }
    })
  }

})