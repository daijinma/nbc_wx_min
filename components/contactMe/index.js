// components/contactMe/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModal: false
  },
  lifetimes:{
    attached(){
      setTimeout(()=>{
        var value = wx.getStorageSync('qrcode_show')
        if(value != "1") {
          this.openModal()
        }
      }, 8000)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 弹框打开事件处理函数
    openModal: function() {
      wx.setStorage({
        key: "qrcode_show",
        data: "1",
      })

      wx.previewImage({
        current: "https://nbc-static.oss-cn-beijing.aliyuncs.com/nbc_banner.jpeg", // 当前显示图片的http链接
        urls: ['https://nbc-static.oss-cn-beijing.aliyuncs.com/nbc_banner.jpeg']
      })
  
    },

    // 弹框关闭事件处理函数
    closeModal: function() {
      this.setData({
        showModal: false,
      });
    },

  }
})
