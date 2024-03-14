import { navigateTo } from "../../utils/index"
import {
  reportEvent
} from "../../utils/event"

// components/ShareBar/index.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    key: String,
    from: String,
    collects: {
      type: String,
      default: '0'
    },
    likes: {
      type: String,
      default: '0'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    t: 0,
    has_collects: false,
    has_likes: false,
    collectsdhdata: {},
    likesdhdata: {},
  },
  lifetimes: {
    attached() {
      const t = setInterval(() => {
        this.getHandleStatus('likes')
        this.getHandleStatus('collects')
      }, 200)

      this.setData({
        t
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getHandleStatus(keys) {

      const { key } = this.properties
      const { t } = this.data

      if (key.includes('undefined')) {
        return
      }
      t && clearInterval(t)
      const fav = wx.getStorageSync(key+"_"+keys)
      const data = {}
      data['has_'+keys] = fav
      this.setData(data)
    },
    setHandle(e:any) {
      const {
        dataset:{
          keys
        }
      } = e.currentTarget
      const { key } = this.properties
      const fav = this.data['has_'+keys]
      const store_key = key+"_"+keys
      wx.setStorageSync(store_key, !fav)

      const data = {}
      data['has_'+keys] = !fav
      if (!fav) {
        this.playAnimation(keys, () => {
          this.setData(data)
        })
      } else {
        this.setData(data)
      }

    },
    goApply() {
      const { from } = this.properties

      reportEvent('designfromnews', {
        from
      })
      
      navigateTo("/pages/applyDesign/index?from="+from)
    },
    playAnimation(key: string, callback: any) {
      const animation = wx.createAnimation({
        duration: 600
      })
      animation.scale(0.4).step({
        duration: 100
      })
      animation.scale(1.2).step({
        duration: 300
      })
      animation.scale(1).step({
        duration: 100
      })

      setTimeout(() => {
        callback()
      }, 100)

      const data = {}
      data[key + 'dhdata'] = animation.export()
      this.setData(data)
    }
  }
})
