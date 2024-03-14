// components/MyCaseForm/index.ts
import { navigateTo } from "../../utils/index"
import reportUserAndInfo from "../../utils/reportUser"
import saveForm from "../../api/saveForm"
// import login from '../../api/login'
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
      default:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    area: "60",
    city: "北京",
    btnType: 1,
  },
  lifetimes:{
    attached(){
      // wx.getPrivacySetting({
      //   success: (res: any) => {
      //     console.log(res, 'getPrivacySetting');

      //     if(!res.needAuthorization){

      //       this.getLoginStatus()
      //       .then(open_id=>{
      //         this.setData({
      //           btnType: open_id?3:2
      //         })
      //       })
      //     }
      //   },
      // });
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    styleChange(e: any) {
      const value = e.detail.value;
      this.setData({
        style: value
      })
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
    cityChange(e: any) {
      const value = e.detail.value;
      this.setData({
        city: value
      })
    },
    layoutChange(e: any) {
      const value = e.detail.value;
      this.setData({
        layout: value
      })
    },
    bindKeyInput(e: any) {
      this.setData({
        area: e.detail.value
      })
    },
    sumitMyInfo() {
      const {btnType}=this.data;
      const {
        from
      } = this.properties
      if(btnType === 3){
        reportEvent("bannerclick",{
          auto: 1,
          from
        })
      }
      saveForm(this.data)
      .then(res=>{
        reportEvent("getphonefrombanner", {
          from
        })

        navigateTo('/pages/applySuccess/index?type=design&from='+from)
      })
    },
    showLogin(e:any) {
      const {
        area,
        city
      } = this.data
      reportUserAndInfo({
        area,
        city
      },()=>{
        this.sumitMyInfo()
      }, e)
      
    },
    apply() {
      const {
        from
      } = this.properties
      navigateTo('/pages/applySuccess/index?type=design&from='+from)
    },
    getrealtimephonenumber(e:any){
      const {
        from
      } = this.properties
      reportEvent("bannerclick",{
        auto: 0,
        from
      })
      this.showLogin(e)
    }
  }
})
