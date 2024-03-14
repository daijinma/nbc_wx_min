export const reportEvent = (event_name:string, params:any={}) => {
  try{
    wx.reportEvent(event_name, params) 
    console.log('====> reportEvent: ' ,  event_name, params)
  }catch(e){}
}