// app.js
App({
  onLaunch() {
    const that = this;
    // 登录
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://nbc.daijinma.cn/api/min/user/get',
            data: {
              code: res.code
            },
            success: function ({
              data: {
                data: res
              }
            }) {

              if (res.mobile) {
                that.globalData.nbcInfo = {
                  ...res,
                  ext: null,
                }
                that.globalData.config = res.ext
                that.waitPromise.forEach(p => p(that.globalData))

              } else {
                that.waitPromise.forEach(p => p(that.globalData))
              }

            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  waitPromise: [],
  getGlobal() {
    if (this.globalData.nbcInfo) {
      return Promise.resolve(this.globalData)
    }
    return new Promise(resolve => {
      this.waitPromise.push(resolve)
    })
  },
  globalData: {
    nbcInfo: null,
    config: null

  }
})