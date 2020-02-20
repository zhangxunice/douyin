const app = getApp()

Page({
  data: {
    // 用于分页的属性
    totalPages: 1,
    page: 1, //当前页数
    videoList: [],

    screenWidth: 350,

    serverUrl: '',
    searchValue: ''
  },

  showVideoInfo: function(e) {

    var videoList = this.data.videoList
    var arrindex = e.target.dataset.arrindex
    var videoInfo = JSON.stringify(videoList[arrindex])
    wx.navigateTo({
      url: '../videoInfo/videoInfo?videoInfo=' + videoInfo,
    })

  },

  onLoad: function(params) {

    var searchValue = params.searchValue
    var isSave = params.isSave
    if (isSave == null || isSave == '' || isSave == undefined) {
      isSave = 0
    }
    this.setData({
      searchValue: searchValue
    })

    var screenWidth = wx.getSystemInfoSync().screenWidth;
    this.setData({
      screenWidth: screenWidth,
    });

    wx.showLoading({
      title: '加载中',
    })
    var page = this.data.page


    this.getAllVideos(isSave, page)



  },


  getAllVideos: function(isSave, page) {
    var serverUrl = app.serverUrl
    var searchContext = this.data.searchValue
    wx.request({
      url: serverUrl + '/video/allVideos?isSaveRecord=' + isSave + '&page=' + page, //仅为示例，并非真实的接口地址
      data: {
        videoDesc: searchContext
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        wx.hideLoading()
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        console.log(res.data)
        if (page == 1) {
          this.setData({
            videoList: [],
          })
        }

        var videoList = res.data.data.records
        var newVideoList = this.data.videoList
        this.setData({
          videoList: newVideoList.concat(videoList),
          page: page,
          totalPages: res.data.data.pages,
          serverUrl: serverUrl
        })

      }
    })
  },


  //上拉刷新
  onReachBottom: function() {
    var currentPage = this.data.page
    var totalPages = this.data.totalPages

    if (currentPage == totalPages) {
      wx.showToast({
        title: '小慕也有底线',
        icon: 'none',
        duration: 2000
      })
    }

    var page = currentPage + 1
    this.getAllVideos(0, page)

  },

  //下拉刷新
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    this.getAllVideos(0, 1)
  }






})