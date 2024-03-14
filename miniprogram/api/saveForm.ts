import { request } from "../utils/request"

export default async (options={})=>{
  return await request({
    url: "/api/user/saveInfo",
    method: 'POST',
    data: {
      open_id: wx.getStorageSync('open_id'),
			house_type:'',
			style:'',
			area:'',
      ...options
    }
  })
}