// components/ListShared/index.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    collects: {
      type: String,
      default: '0'
    },
    likes: {
      type: String,
      default: '0'
    },
    key: {
      type: String,
      default: '0'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    has_collects: false,
    has_likes: false,
  },
  lifetimes: {
    attached() {
      setTimeout(() => {
        this.getHandleStatus('likes')
        this.getHandleStatus('collects')
      }, 200)

    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
      
    getHandleStatus(keys) {

      const { key } = this.properties

      if (key.includes('undefined')) {
        return
      }

      const fav = wx.getStorageSync(key + "_" + keys)
      const data = {}
      data['has_' + keys] = fav
      this.setData(data)
    }
  }
})
