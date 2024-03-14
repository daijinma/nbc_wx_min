// components/MyCaseForm/index.ts
import { navigateTo } from "../../utils/index"
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
    area: "60",
    city: "北京",
    btnType: 1,
    selected: 0,
    houseList:[
      "一居",
      "二居",
      "三居",
      "四居及以上"
    ],
    phones:[
      "138****1342","150****5678","136****9876","139****3456","158****8765","177****2345","135****6543","187****8901","159****4321","137****7890"
    ]
  },
  lifetimes:{
    attached(){
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
    changeHouse(e: any) {
      this.setData({
        selected: e.currentTarget.dataset.value
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
    bindKeyInput(e: any) {
      this.setData({
        area: e.detail.value
      })
    },
    sumitMyInfo() {
      const {btnType}=this.data;
      if(btnType === 3){
        const from = this.properties.from
        reportEvent('price1_click', {
          auto: 1,
          from
        })
      }

      const {
        area,
        houseList,
        selected,
        city
      } = this.data
      const house_type = houseList[selected]
      saveForm({
        area,
        house_type,
        city
      })
      .then(res=>{
        const from = this.properties.from

        reportEvent('submitfromprice', {
          from
        })
        navigateTo('/pages/applySuccess/index?type=quote&from='+from)
      })
    },
    showLogin(e:any) {
      const {
        area,
        houseList,
        selected,
        city
      } = this.data
      const house_type = houseList[selected]
      reportUserAndInfo({
        area,
        house_type,
        city
      },()=>{
        this.sumitMyInfo()
      }, e)
      
    },
    apply() {
      const from = this.properties.from

      navigateTo('/pages/applySuccess/index?type=quote&from='+from)
    },
    getrealtimephonenumber(e:any){
      const from = this.properties.from
        reportEvent('price1_click', {
          auto: 0,
          from
        })
      this.showLogin(e)
    }
  }
})
