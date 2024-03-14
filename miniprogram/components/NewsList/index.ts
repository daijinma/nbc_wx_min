// components/NewsList/index.ts
import { request } from "../../utils/request"

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: <any>{
    columnHeights: [0, 0],
    column1Data: [],
    column2Data: [],
    page_num: 1,
    seed: parseInt(Math.random() * 1000)
  },
  lifetimes: {
    attached() {
      wx.$event.on("pullUpLoad", this, this.loadMore)
      wx.$event.on("pullDownRefresh", this, this.refresh)
      this.getList()
    },
    detached() {
      wx.$event.remove("pullUpLoad", this)
      wx.$event.remove("pullDownRefresh", this)
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    createSeed(){
      this.setData({
        seed: parseInt(Math.random() * 1000)
      })
    },
    async getList() {
      const {
        page_num,
        columnHeights,
        column1Data,
        column2Data,
        seed
      } = this.data
      const resp: any = await request('/api/random?seed='+seed+'&page_size=20&page_num=' + page_num)

      const newColumn1Data: any = [], newColumn2Data: any = [];

      if (resp.data) {
        const rightStart = columnHeights[0] < columnHeights[1]
        resp.data.map((item: any, index: number) => {
          const url = item.cover
          let hengshu = 'shu';
          item.key = item.list_type +'_'+ item.id + '_'+ Math.random();
          try{
            const ratio = url.split('/upload/')[1].split('_')[0]
            if(ratio.length < 5 && parseInt(ratio) < 100){
              hengshu = 'heng'
            }
          }catch(e){}

          item.hengshu = hengshu;
          
          if (rightStart) {
            if (index % 2 == 0) {
              newColumn2Data.push(item)
            } else {
              newColumn1Data.push(item)
            }
          } else {
            if (index % 2 == 0) {
              newColumn1Data.push(item)
            } else {
              newColumn2Data.push(item)
            }
          }
        })
      }

      if(page_num == 1){
        column1Data && (column1Data.length = 0)
        column2Data && (column2Data.length = 0)
      }

      this.setData({
        column1Data: [
          ...column1Data,
          ...newColumn1Data
        ],
        column2Data: [
          ...column2Data,
          ...newColumn2Data
        ]
      }, () => {
        // 计算现有两个 列高度 存起来下次插入时确定
        this.recheckColumHeight()
      })
    },

    recheckColumHeight() {
      var column1 = wx.createSelectorQuery().in(this).select('#column1');
      var column2 = wx.createSelectorQuery().in(this).select('#column2');
      column1.boundingClientRect((rect) => {
        if(!rect?.height) return
        var height1 = rect.height; // 获取元素的高度
        column2.boundingClientRect((rect) => {
          var height2 = rect.height; // 获取元素的高度
          this.setData({
            columnHeights: [height1, height2]
          })
        }).exec();
      }).exec();
    },

    refresh() {
      console.log('refresh... news')
      this.createSeed()
      this.setData({
        columnHeights: [0, 0],
        page_num: 1
      }, () => {
        this.getList()
      })
    },
    loadMore() {
      console.log('loading...')

      this.setData({
        page_num: this.data.page_num + 1
      }, () => {
        this.getList()
      })
    }
  }
})
