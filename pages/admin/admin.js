// pages/admin/admin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resp: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const t = this;
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://nbc.daijinma.cn/api/min/user/getOpenId',
            data: {
              code: res.code
            },
            success ({
              data: res
            }) {
              t.setData({
                resp: JSON.stringify(res)
              })
              console.log(JSON.stringify(res), this)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})