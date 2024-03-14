// components/Swipers/index.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      detail: {
        type: Object,
        default: {}
      }
    },

    /**
     * 组件的初始数据
     */
    data: {
      imageShow:[],
      showPreload:true,
      swiperHeight: '0',
      currentBanner: 1,  
    },

    /**
     * 组件的方法列表
     */
    methods: {
        toPreviewImage(e: any) {
          const {
            url
          } = e?.target?.dataset;
          wx.previewImage({
            urls: this.data.detail?.banner,
            current: url,
          })
        },
      setSwiperHeight(e: any) {
        const {
          index
        } = e.target.dataset
        if(this.data.imageShow[index]) return

        const {
          width, height
        } = e.detail

        if(index == 0) {
          this.setData({
            swiperHeight: (height / width) * 100 + 'vw',
          })
        }
        var key = `imageShow[${index}]`
        this.setData({
         [key] : height <= width ?'h':'s'
        },()=>{
          const {
            imageShow,
            detail
          } = this.data
          if(imageShow[0] && String(imageShow[0]).startsWith("aspect")) return
          const len = imageShow.length;
          const len2 = imageShow.filter(i=>!!i).length;
          const len3 = detail.banner.length;
          if(len === len2 && len === len3){
            const replace = {
              "h": "aspectFill",
              "s": "aspectFit"
            }
            if(imageShow[0] == "s"){
              replace['h'] = "aspectFit"
              replace['s'] = "aspectFill"
            }
            this.setData({
              imageShow : imageShow.map((i)=>replace[i])
             })
             console.log('imageShow1', imageShow)
             console.log('imageShow2', imageShow.map((i)=>replace[i]))
          }
        })
    
      },
      changeBanner(e: any) {
        if(e.detail.current == 1){
            this.setData({
              showPreload: false,
            })
        }
        this.setData({
          currentBanner: e.detail.current + 1
        })
      },
      imageLoad: function (e) {//获取图片真实宽度  
        var imgwidth = e.detail.width,
          imgheight = e.detail.height,
          //宽高比  
          ratio = imgwidth / imgheight;
        // console.log(imgwidth, imgheight)
        //计算的高度值  
        var viewHeight = 750 / ratio;
        var imgheight = viewHeight;
        var imgheights = this.data.imgheights;
        //把每一张图片的对应的高度记录到数组里  
        imgheights[e.target.dataset.id] = imgheight;
        this.setData({
          imgheights: imgheights
        })
      }
    }
})
