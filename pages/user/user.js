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

  changeMock(e) {
    const {
      user: {
        openid
      }
    } = this.data
    wx.showLoading({
      title: 'loading...',
    })
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)

    const checked = e.detail.value.includes('changeMock')

    wx.request({
      url: 'https://nbc.daijinma.cn/api/min/user/save?openid=' + openid,
      method: "POST",
      header: {
        "content-type": "application/json"
      },
      data: {
        mockValue: checked
      },
      success: function ({
        data: res
      }) {
        wx.hideLoading({
          success: (res) => {},
        })
        if (res.result === 'ok') {
          if (app.globalData.config) {
            app.globalData.config.mockValue = checked
          }
        }
      }
    })
  }
})