import { request } from "../utils/request"

const filter_key = 'city'

wx.removeStorageSync(filter_key);
export default async ()=>{
  const filters = wx.getStorageSync(filter_key)
  if(filters){
    return filters
  }
  const resp = await request("/api/getCity")
  const {
    location
  } = resp;
  wx.setStorageSync(filter_key, location)
  return location
}