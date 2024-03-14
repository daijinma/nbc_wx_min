import { request } from "../utils/request"

const filter_key = 'filters'

wx.removeStorageSync(filter_key);
export default async ()=>{
  const filters = wx.getStorageSync(filter_key)
  if(filters){
    return JSON.parse(filters)
  }
  const resp = await request("/api/houseType/list")
  const {
    area, house_type, style
  } = resp.data;
  wx.setStorageSync(filter_key, JSON.stringify({
    area, house_type, style
  }))
  return {
    area, house_type, style
  }
}