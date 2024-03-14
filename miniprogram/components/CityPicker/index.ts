import citys from "../../assets/json/city"
import getCity from "../../api/getCity"

let list = []

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:{
      type: String,
      default: 'small'
    }
  },
  lifetimes:{
    async attached(){
      let location = await getCity();
      citys.objectMultiArray.forEach((item)=>{
        if(location.includes(item.regname)){
          this.setData({
            sug: item.regname
          })
          this.triggerEvent('change', {
            value: item.regname
          })
        }
      })
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    sug: "",
    multiIndex:[0,0],
    multiArray: citys.multiArray,
    objectMultiArray: citys.objectMultiArray
  },
  methods:{
    bindMultiPickerChange(e:any){
      const [index0, index1] = e.detail.value
      this.setData({
        sug: "",
        "multiIndex[0]": index0,
        "multiIndex[1]": index1
      },()=>{
        this.triggerEvent('change', {
          value: this.data.multiArray[1][index1]
        })
      })
    },
    bindMultiPickerColumnChange (e){
      switch (e.detail.column){
        case 0:
          list = []
          for (var i = 0; i < this.data.objectMultiArray.length;i++){
            if (this.data.objectMultiArray[i].parid == this.data.objectMultiArray[e.detail.value].regid){
              list.push(this.data.objectMultiArray[i].regname)
            }
          }
          this.setData({
            sug: "",
            "multiArray[1]": list,
            "multiIndex[0]": e.detail.value,
            "multiIndex[1]" : 0
          })
      }
    }
  }
})
