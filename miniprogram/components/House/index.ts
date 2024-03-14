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
      tags: ''
    },
    lifetimes:{
      attached(){
        const {
          area_name,
          style_name,
          house_type_name
        } = this.properties.item;
        this.setData({
          tags: [style_name, area_name.replace('平','m²'), house_type_name].filter(i=>!!i).join('·')
        })
      }
    },

    /**
     * 组件的方法列表
     */
    methods: {
      goHouseDetail(){
        const {
          item:{
            id = 0
          }
        } = this.properties
        navigateTo('/pages/houseDetail/index?id='+id)
      },
    }
})
