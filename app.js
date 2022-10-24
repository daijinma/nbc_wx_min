// app.js
App({
  onLaunch() {
    // 登录
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://nbc.daijinma.cn/api/min/user/get',
            data: {
              code: res.code
            },
            success: function({data:res}){
              console.log(res.data)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
