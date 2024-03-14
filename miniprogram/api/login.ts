import { request } from "../utils/request"

const openId_key = 'open_id'

wx.removeStorageSync(openId_key);

export default async (code:String, phoneCode: String)=>{
  const old_open_id = wx.getStorageSync(openId_key)
  if(!phoneCode && old_open_id){
    return old_open_id
  }
  const resp = await request("/api/user/getPhoneNumber?code="+code + "&phoneCode="+phoneCode)
  const open_id = resp.data;
  wx.setStorageSync(openId_key, open_id.open_id?open_id.open_id:open_id)
  return open_id
}