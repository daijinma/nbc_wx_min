// components/NewsList/index.ts
import { request } from "../../utils/request"

Component({
    /**
     * 组件的属性列表
     */
    properties: {
      detail:{
        type: Object,
        default:{}
      }
    },

    /**
     * 组件的初始数据
     */
    data: <any>{
        list: [],
    },
    lifetimes: {
        attached() {
            this.getMore()
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        async getMore() {
            const {
                id,
                area_id,
                house_type_id,
                style_id
            } = this.properties.detail
            console.log(id,
              area_id,
              house_type_id,
              style_id)
            const resp: any = await request(`/api/house/more?size=2&id=${id}&area_id=${area_id}&house_type_id=${house_type_id}&style_id=${style_id}`)

            this.setData({
                list: resp.data
            })
        }
    }
})
