import { navigateTo } from "../../utils/index"
import {
  reportEvent
} from "../../utils/event"

// components/EntryFour/index.ts
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
      animateTag: -1,
      dhdata: [{}, {}]
    },
    lifetimes:{
      attached(){
        const random_num = parseInt(Math.random()*2)
        this.setData({
          animateTag: random_num
        })
        this.animateAction()
      }
    },

    /**
     * 组件的方法列表
     */
    methods: {
      animateAction(){
        this.playAnimation(()=>{
          setTimeout(()=>{
            this.animateAction()
          }, 4000)
        })
      },
      goHouseList(){
        navigateTo('/pages/houseList/index?from=index')
      },
      goApplyQuote(){
        reportEvent("price1", {
          from: 'icon3'
        })
        navigateTo('/pages/applyQuote/index?from=icon3')
      },
      goApplyDesign(){
        navigateTo('/pages/applyDesign/index?from=icon1')
      },
      goApplyDesign2(){
        navigateTo('/pages/applyDesign/index?from=icon5')
      },
      goTestStyleStart(){
        navigateTo('/pages/testStyleStart/testStyleStart')
      },
      playAnimation(callback:any){
        const {
          animateTag
        } = this.data
        const animation = wx.createAnimation({
          duration: 1000,
          transformOrigin: 'left bottom 0',
          timingFunction: 'ease'
        })
        animation.scale(0).step({
          duration: 1
        })
        animation.scale(1).step({
          duration: 300
        })
        animation.rotate(-15).step({
          duration: 300
        })
        animation.rotate(5).step({
          duration: 300
        })
        animation.rotate(0).step({
          duration: 50
        })

        setTimeout(()=>{
          callback()
        }, 1000)
        const data = {}
        data[`dhdata[${animateTag}]`] = animation.export()
        this.setData(data)
      }
    }
})