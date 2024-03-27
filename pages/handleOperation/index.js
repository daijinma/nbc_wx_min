// pages/handleOperation/index.js
const mainUrl = 'https://nbc.daijinma.cn/api/min'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list :[],
    showModal: false,
    current: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.loadDate()
  },
  closeDialog(){
    this.setData({
      showModal: false,
      current: {}
    })
  },
  showDialog(event){
    
    const item = event.currentTarget.dataset.item || {}
    this.setData({
      showModal: true,
      current: item
    })
  },
  loadDate(){
    wx.showLoading({
      title: '正在努力加载中',
    })
    return wx.request({
      url: mainUrl + '/handle/all',
      method: 'GET',
      success: ({
        data
      }) => {
        wx.hideLoading();
        this.setData(data)
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '哎呀，加载失败了',
          icon: 'none',
          duration: 1000
        })
      }
    })
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