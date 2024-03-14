// components/MyCaseForm/index.ts
import { navigateTo } from "../../utils/index"
import getFilter from "../../api/houseType"
import reportUserAndInfo from "../../utils/reportUser"
import saveForm from "../../api/saveForm"
// import login from '../../api/login'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    key:{
      type: String,
      default:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    style: "0",
    house_type: "0",
    area: "",
    city: "北京",
    btnType:1,
    styleList: [],
    houseTypeList: []
  },
  lifetimes:{
    async attached(){
      const data = await getFilter()
      this.setData({
        houseTypeList: ['不限'].concat(data.house_type.map(i=>i.name)),
        styleList: ['不限'].concat(data.style.map(i=>i.style_name)),
      })
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
    cityChange(e: any) {
      const value = e.detail.value;
      this.setData({
        city: value
      })
    },
    houseTypeChange(e: any) {
      const value = e.detail.value;
      this.setData({
        house_type: value
      })
    },
    bindKeyInput(e: any) {
      this.setData({
        area: e.detail.value
      })
    },
    sumitMyInfo() {
      const {
        style,
        house_type,
        area,
        city
      } = this.data
      saveForm({
        style,
        house_type,
        area,
        city
      })
      .then(res=>{
        navigateTo('/pages/applySuccess/index?type=design')
      })
    },
    showLogin(event:any) {
      const {
        style,
        house_type,
        area,
        city
      } = this.data
      reportUserAndInfo({
        style,
        house_type,
        area,
        city
      },()=>{
        saveForm({
          style,
          house_type,
          area,
          city
        })
        .then(res=>{
          this.apply()
        })
      }, event)
    },
    apply() {
      navigateTo('/pages/applySuccess/index?type='+this.properties.key)
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
      this.showLogin(e)
    }
  }
})
