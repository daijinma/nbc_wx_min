// components/GoldenTag/index.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      text:{
        type: String,
        default: ""
      },
      autoplay: {
        type: Boolean,
        default: ()=> true
      },
      size:{
        type: String,
        default:'large'
      }
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

    }
})
