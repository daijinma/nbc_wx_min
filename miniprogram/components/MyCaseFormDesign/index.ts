// components/MyCaseForm/index.ts
import { navigateTo } from "../../utils/index"
import getFilter from "../../api/houseType"
import reportUserAndInfo from "../../utils/reportUser"
import saveForm from "../../api/saveForm"
import login from '../../api/login'
import {
  reportEvent
} from "../../utils/event"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    from:{
      type: String,
      default: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    area: "",
    btnType:1,
    selected: 1,
    areaList:[
      "40m²以下",
      "40～80m²",
      "80～120m²",
      "120m²以上"
    ],
  },
  lifetimes:{
    async attached(){
      wx.getPrivacySetting({
        success: (res: any) => {
          console.log(res, 'getPrivacySetting');
          if(!res.needAuthorization){
            this.getLoginStatus()
            .then(open_id=>{
              this.setData({
                btnType: open_id?3:2
              })
            })
          }
        },
      });
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    changeArea(e: any) {
      this.setData({
        selected: e.currentTarget.dataset.value
      })
    },
    sumitMyInfo() {
      const {btnType}=this.data;
      if(btnType === 3){
        const from = this.properties.from
        reportEvent('submitfromdesign_click', {
          auto: 1,
          from
        })
      }

      const {
        selected,
        areaList
      } = this.data
      const area = areaList[selected]
      saveForm({
        area,
      })
      .then(res=>{
        const from = this.properties.from

        reportEvent('submitfromdesign', {
          from
        })
  
        navigateTo('/pages/applySuccess/index?type=design&from='+from)
      })
    },
    showLogin(event:any) {
      const {
        selected,
        areaList
      } = this.data
      const area = areaList[selected]
      reportUserAndInfo({
        area,
      },()=>{
        
        saveForm({
          area,
        })
        .then(res=>{
          this.apply()
        })
      }, event)
    },
    apply() {
      const from = this.properties.from
      navigateTo('/pages/applySuccess/index?type=design&from=' + from)
    },
    async getLoginStatus() {
      return new Promise((resolve) => {
        wx.login({
          success: async (res) => {
            console.log("换取openid 判断用户状态", res)
            const open_id = await login(res.code, '')

            resolve(open_id)
          }
        })
      })
    },
    getrealtimephonenumber(e:any){
      const from = this.properties.from
      reportEvent('submitfromdesign_click', {
        auto: 0,
        from
      })
      this.showLogin(e)
    }
  }
})
