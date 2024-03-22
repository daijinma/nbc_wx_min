// components/inputDialog/index.js
const mainUrl = 'http://localhost:13026/api/min'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: Boolean,
  },


  /**
   * 组件的初始数据
   */
  data: {
    sugFish:null,
    sug:[],
    form:{
      name:'',
      size: "",
      price: "",
      num: 1
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close(){
      this.triggerEvent("close")
    },
    onInputName: function (event) {
      const value = event.detail.value;
      this.setData({
        "form.name": value,
        sug:[]
      })
      clearTimeout(this.timer); // 清除上一次的延时查询

      if (value.trim() !== '') {
        this.timer = setTimeout(() => {
          this.search(value);
        }, 500); // 延时 500 毫秒执行查询
      }
       
    },
    search(value){
      return wx.request({
        url: mainUrl + '/handle/search?key='+value,
        method: 'GET',
        success: ({
          data
        }) => {
          this.setData({
            sugFish:null,
            sug: data.list
          })
        },
        fail: function () {
          
        }
  
      })
    },
    radioChange(event){
      const value = event.detail.value;
      const sug = this.data.sug
      let sugFish = {}
      value && sug.forEach(item=>{
        if(item.id === parseInt(value)){
          sugFish = item
        }
      })

      const data = {
        sugFish
      }
      if(sugFish.name){
        data["form.name"] = sugFish.name
      }
      this.setData(data)
      console.log(data)
    },
    onInputSize(event){
      const index = event.detail.value;
      const sugFish = this.data.sugFish;
      const sizes = sugFish.size;
      const prices = sugFish.price;
      this.setData({
        "form.size": sizes[index],
        "form.price": prices[index]
      })
    },
    onInputPrice(event){
      const value = event.detail.value;
      
      this.setData({
        "form.price": value
      })
    },
    onInputNum(event){
      const value = event.detail.value;
      
      this.setData({
        "form.num": value
      })
    },
    submit(){
      const form = this.data.form;
      if(form.num && form.price && form.name && form.size){
        console.log(form)
      }else{
        wx.showToast({
          title: '请完善信息',
          icon: 'none',
          duration: 1000
        })
      }
    }

  }
})
