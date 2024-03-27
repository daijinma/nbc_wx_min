// components/inputDialog/index.js
// const mainUrl = 'http://localhost:13026/api/min'
const mainUrl = 'https://nbc.daijinma.cn/api/min'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: Boolean,
    data: Object
  },
  
  observers:{
    
    "show":function(show){
      if(show){
        const {
          data
        } = this.properties

        if(data.id){
          this.setFishData(data)
        }
      }else{
        this.setData({
          form:{
            id:0,
            fish_id: 0,
            name:'',
            size: "",
            price: "",
            quantity: 1
          }
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    sugFish:null,
    sug:[],
    form:{
      id:0,
      fish_id: 0,
      name:'',
      size: "",
      price: "",
      quantity: 1
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setFishData(data){
      const form = {
        id: data.id,
        fish_id: data.fish_id,
        name: data.name,
        size: data.current_size,
        price: data.price,
        quantity:  data.num
      }
      this.setData({
        form
      })

      this.search(data.name)

    },
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
          let sugFish = null;
          const form = this.data.form
          if(form.fish_id){
            data.list.forEach(item=>{
              if(item.id === form.fish_id){
                sugFish = item
              }
            })
            if(!sugFish) sugFish = {}
          } 
          
          this.setData({
            sugFish,
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
      if(sugFish.name){
        data["form.fish_id"] = sugFish.id
      }
      this.setData(data)
      // console.log(data)
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
    onInputSize2(event){
      const value = event.detail.value;
      this.setData({
        "form.size": value,
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
        "form.quantity": value
      })
    },
    submit(){
      const form = this.data.form;
      if(form.quantity && form.price && form.name && form.size){
        wx.showLoading({
          title: '正在努力保存中',
        })
        return wx.request({
          url: mainUrl + '/handle/save',
          method: 'POST',
          data: form,
          dataType: 'json',
          success: ({
            data
          }) => {
            wx.hideLoading();
            this.close()
            this.triggerEvent("refesh")
            // this.setData(data)
          },
          fail: function () {
            wx.hideLoading();
            wx.showToast({
              title: '哎呀，保存失败了',
              icon: 'none',
              duration: 1000
            })
          }
        })
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