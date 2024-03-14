import { showLoginDialog } from "./index"

export default (houseInfo = {}, callback, event:any) => {
  const app = getApp()
  if (app?.globalData?.open_id) {
    console.log('logined and next...')
    callback && callback()
    return
  }
  showLoginDialog({
    ...houseInfo,
    callback: (phoneInfo) => {
      // console.log(phoneInfo, '这里加一些post 储存申请信息')
      callback && callback()
    },
    event
  })
}