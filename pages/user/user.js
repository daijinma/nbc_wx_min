// pages/user/user.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    app.getGlobal()
      .then(res => {

        this.setData({
          user: {
            ...(res?.nbcInfo || {})
          },
          config: res?.config || {}
        })
      })

  },
  orders(){
    wx.showToast({
      icon:"none",
      title: "订单开发中",
    })
  },
  changeMock() {
    const {
      user: {
        openid
      }
    } = this.data
    const that = this;
    wx.showLoading({
      title: 'loading...',
    })

    console.log(app.globalData.config)
    const checked = !app.globalData.config.mockValue

    wx.request({
      url: 'https://nbc.daijinma.cn/api/min/user/save?openid=' + openid,
      method: "POST",
      header: {
        "content-type": "application/json"
      },
      data: {
        mockValue: checked
      },
      success({
        data: res
      }) {
        wx.hideLoading({
          success: (res) => {},
        })
        if (res.result === 'ok') {
          if (app.globalData.config) {
            app.globalData.config.mockValue = checked;
            that.setData({
              config: app.globalData.config
            })

            wx.showToast({
              title: checked?"已开启":"已关闭",
            })
          }
        }
      }
    })
  }
})