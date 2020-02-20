const app = getApp()

Page({
  data: {

  },
  goRegistPage:function(){
    wx.navigateTo({
      url: '../regist/regist',
    })
  },

  doLogin:function(e){
    var formObject = e.detail.value
    var username = formObject.username
    var password = formObject.password

    if (username.length == 0 || password.length == 0) {
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      var severUrl = app.serverUrl
      wx.showLoading({
        title: '登陆中...',
      })
      wx.request({
        url: severUrl + '/login',
        method: 'POST',
        data: {
          username: username,
          password: password
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          wx.hideLoading()
          var status = res.data.status.toString()
          if (status.startsWith('2')) {
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000
            })
            wx.redirectTo({
              url: '../../mine/mine',
            })
            // app.userInfo = res.data.data
            app.setGlobalInfo(res.data.data)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
  }
})