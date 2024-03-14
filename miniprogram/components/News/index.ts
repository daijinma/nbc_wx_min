import { navigateTo } from "../../utils/index"

// components/News/index.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      item:Object
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
      goNewDetail(){
        const {
          item:{
            id = 0
          }
        } = this.properties
        navigateTo('/pages/newsDetail/index?id='+id)
      },
    }
})
