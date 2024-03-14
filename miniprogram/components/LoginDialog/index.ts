// components/LoginDialog/index.ts
import { refreshPage } from '../../utils/index'
import login from '../../api/login'

let temp_options: any = null;
Component({
  /**
   * 组件的属性列表
   */
  properties: {},
  /**
   * 组件的初始数据
   */
  data: {
    isRead: false,
    showPrivacy: false,
    privacyContractName: '',
    needAuthorization: false,
    resolvePrivacyAuthorization: null
  },
  lifetimes: {
    attached() {
      wx.$event.on("loginDialogShow", this, this.showDialog)

      if (wx.onNeedPrivacyAuthorization) {
        wx.onNeedPrivacyAuthorization((resolve: any) => {
          this.setData({
            resolvePrivacyAuthorization: resolve
          })
        });
      }

      if (wx.getPrivacySetting) {
        wx.getPrivacySetting({
          success: (res: any) => {
            console.log(res, 'getPrivacySetting');
            this.setData({
              needAuthorization: res.needAuthorization,
              privacyContractName: res.privacyContractName,
            })
          },
        });
      }
    },
    detached() {
      wx.$event.remove("loginDialogShow", this)
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async showDialog(options) {
      temp_options = options;
      if(options.event){ // 手机号事件
        this.getrealtimephonenumber(options.event)
        return
      }
      const needAuthorization = this.data.needAuthorization;
      if (needAuthorization) {
        this.setData({
          showPrivacy: true
        })
      } else {
        wx.showLoading({
          title: '加载中',
        })
        const open_id = await this.getLoginStatus();
        wx.hideLoading()

        if (open_id && temp_options && temp_options.callback) {
          temp_options.callback({
            open_id
          })
        } else {
          
        }


      }

    },
    openPrivacyContract() {
      wx.openPrivacyContract({
        success: () => {

          wx.showToast({
            title: '遇到错误',
            icon: 'error',
          });

          this.setData({
            isRead: true
          })
        },
        fail: () => {
          wx.showToast({
            title: '遇到错误',
            icon: 'error',
          });
        },
      });
    },
    exitMiniProgram() {
      // wx.exitMiniProgram();
      this.setData({
        showPrivacy: false
      })
    },
    handleAgreePrivacyAuthorization() {
      if (typeof this.resolvePrivacyAuthorization === 'function') {
        this.resolvePrivacyAuthorization({
          buttonId: 'agree-btn',
          event: 'agree',
        });
      }
    },
    async getrealtimephonenumber(e: any) {
      var detail = e.detail
      if (detail.errMsg == "getPhoneNumber:ok") {
        var phoneCode = detail.code
        console.log("用户同意授权", phoneCode)
        if(!phoneCode) return
        wx.showLoading({
          title: '加载中',
        })
        const open_id = await this.setLoginStatus(phoneCode);
        wx.hideLoading()

        if (open_id && temp_options && temp_options.callback) {
          temp_options.callback({
            open_id
          })
        } else {
          refreshPage()
        }
      }
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
    async setLoginStatus(phoneCode:string) {
      return new Promise((resolve) => {
        wx.login({
          success: async (res) => {
            console.log("code + phone ", res)
            const open_id = await login(res.code, phoneCode)

            resolve(open_id)
          }
        })
      })
    }
  }
})
