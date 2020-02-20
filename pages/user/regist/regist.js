const app = getApp()

Page({
  data: {

  },

  goLoginPage: function() {
    wx.redirectTo({
      url: '../login/login',
    })
  },

  doRegist: function(e) {
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
      wx.request({
        url: severUrl + '/regist',
        method: 'POST',
        data: {
          username: username,
          password: password
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          var status = res.data.status.toString()
          if (status.startsWith('2')) {
            wx.showToast({
              title: '注册成功',
              icon: 'none',
              duration: 2000
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