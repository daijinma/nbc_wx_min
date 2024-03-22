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
      // setTimeout(()=>{
      //     this.openModal()
      // }, 8000)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 弹框打开事件处理函数
    openModal: function() {
      // 设置弹框相关数据
      // this.setData({
      //   showModal: true,
      //   imageUrl: 'https://example.com/main-image.png',
      //   description: '这是一些文案说明',
      // });

      wx.previewImage({
        current: "https://nbc-static.oss-cn-beijing.aliyuncs.com/qrcode.jpeg", // 当前显示图片的http链接
        urls: ['https://nbc-static.oss-cn-beijing.aliyuncs.com/qrcode.jpeg']
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
