// index.ts
// 获取应用实例
import { showLoginDialog } from "../../utils/index"

Page({
  data: {},
  onReady() { },
  onLoad(options) {
    wx.login({
      success: async (res) => {
        this.setData({
          loading: false
        })
      }
    })
  },
  onPullDownRefresh() {
    let list = this.selectComponent('#list')
    setTimeout(() => {
      wx.stopPullDownRefresh()
      list.refresh()
    }, 1000)
  },
  onReachBottom() {
    wx.$event.emit("pullUpLoad")
  },
  onShareAppMessage() {
  },
  onShareTimeline(){}
})
