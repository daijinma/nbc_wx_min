// pages/products/products.js
// https://github.com/vanclimber/MiniProgram-diancan/blob/master/app.wxss
// https://github.com/vanclimber/MiniProgram-diancan

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [], //存放商品列表
    typeList: [],
    renderList: [],
    originList: [],
    shoppingCart: [],
    titleTopList: [],
    totalPrice: 0,
    showCartDetail: false,
    fishDetail: {},
    totalNumber: 0,
    rpxToPx: 2,
    menuIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFish()

    // rpx和px进行转换
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          rpxToPx: res.screenWidth / 750
        })
      }
    });

  },

  getFish() {
    wx.showLoading({
      title: '正在努力加载中',
    })
    return wx.request({
      url: 'http://localhost:3000/api/min/products/v2/all',
      method: 'GET',
      success: ({
        data
      }) => {
        wx.hideLoading();
        
        const list =  [];
        const list_id =  [];
        data.list.forEach(item=>{
          const id = `${item.fish_id}_${item.num}_${item.price}`
          item._id = id;
          const {
            fish_id,
            fish_name,
            category,
            fish_image_url,
            current_size,
            current_appearance
          } = item;
          const index = list_id.indexOf(fish_id)
          if(index>=0){
            list[index].size.push(current_size)
            list[index].appearance.push(current_appearance)
            list[index].detail.push(item)
          }else{
            list_id.push(fish_id)
            list.push({
              fish_id,
              fish_name,
              category,
              fish_image_url,
              size:[current_size],
              appearance: [current_appearance],
              detail:[item]
            })
          }
        });

        console.log(list)
        this.setData({
          renderList: list,
          originList: data.list
        })
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '哎呀，加载失败了',
          icon: 'none',
          duration: 1000
        })

      }

    })
  },


  // 收藏菜品
  starGoods: function (e) {
    let goodsData = this.data.goodsList;
    let id = e.target.dataset.item.id;
    for (let i in goodsData) {
      for (let j in goodsData[i]) {
        if (id === goodsData[i][j].id) {
          goodsData[i][j].isStar = !goodsData[i][j].isStar;
          this.setData({
            goodsList: goodsData
          })
          return;
        }

      }
    }



  },

  // 更改商品数量
  controlGoodsNum: function (e) {
    let shoppingCartCopy = this.data.shoppingCart;
    let fishDetail = this.data.fishDetail;
    let has = false;
    shoppingCartCopy = shoppingCartCopy.map(item => {
      if (
        (item.id + item.fishDetailSizeIndex + item.fishDetailAppearanceIndex) == (fishDetail.id + fishDetail.fishDetailSizeIndex + fishDetail.fishDetailAppearanceIndex)
      ) {
        item.number = 1;
        has = true;
      }
      return item;
    })

    if (!has) {
      fishDetail.number = 1;
      shoppingCartCopy.push(JSON.parse(JSON.stringify(fishDetail)));
      wx.showToast({
        title: '添加成功',
      })

      setTimeout(() => {
        wx.hideToast()
      }, 2000)
    }

    this.setData({
      shoppingCart: shoppingCartCopy,
      fishDetail: {},
      totalPrice: this.data.totalPrice + 1 * (Number(fishDetail.price[fishDetail.fishDetailSizeIndex] || 0) + Number(fishDetail.appearance_price[fishDetail.fishDetailAppearanceIndex] || 0)),
      totalNumber: this.data.totalNumber + 1
    })




  },

  // 开关购物车详情页面
  controlCart: function () {
    if (this.data.totalNumber != 0) {
      var controller = this.data.showCartDetail;
      this.setData({
        showCartDetail: !controller
      })
    }
  },
  // 关闭购物车
  hideCart: function () {
    this.setData({
      showCartDetail: false
    })
  },
  // 打开购物车
  showCart: function () {
    this.setData({
      showCartDetail: true
    })
  },
  hideDetail: function () {
    this.setData({
      fishDetail: {}
    })
  },
  // 清空购物车
  clearCart: function () {
    let goodsData = this.data.goodsList;
    for (let i in goodsData) {
      goodsData[i].number = 0;
    }

    this.setData({
      totalNumber: 0,
      totalPrice: 0,
      shoppingCart: [],
      goodsList: goodsData,
      showCartDetail: false
    })
  },
  // 购物车内实现数量改变
  goodsNumInCart: function (e) {
    let item = e.currentTarget.dataset.item;
    let num = e.currentTarget.dataset.num;
    let list = this.data.shoppingCart;
    let goodsData = this.data.goodsList;
    for (let index in list) {
      if (item.id === list[index].id) {
        list[index].number += num;
        if (list[index].number === 0) {
          list.splice(index, 1);
        }
        break;
      }
    }

    this.setData({
      totalNumber: this.data.totalNumber + num,
      totalPrice: this.data.totalPrice + num * (Number(item.price[item.fishDetailSizeIndex] || 0) + Number(item.appearance_price[item.fishDetailAppearanceIndex] || 0)),
      shoppingCart: list,
      goodsList: goodsData,
      showCartDetail: list.length === 0 ? false : true,
    })
  },

  // 确认订单
  goToConfirm: function () {
    const {
      shoppingCart = [],
        totalPrice = 0
    } = this.data
    if (shoppingCart.length > 0) {
      // wx.setStorageSync('shoppingCart', this.data.shoppingCart);
      // wx.setStorageSync('totalNumber', this.data.totalNumber);
      // wx.setStorageSync('totalPrice', this.data.totalPrice);

      wx.showToast({
        title: '复制成功',
      })

      setTimeout(() => {
        wx.hideToast()
      }, 1000)
      var str = '';

      shoppingCart.forEach(item => {
        var str_1 = `${item.name}
        规格：${item.size[item.fishDetailSizeIndex] || "--"} 
        品相：${item.appearance[item.fishDetailAppearanceIndex] || "--"} 
        单价：${(Number(item.price[item.fishDetailSizeIndex] || 0) +  Number(item.appearance_price[item.fishDetailAppearanceIndex] || 0))}
        数量：${item.number || 1}
` 
        str += str_1;
      })
      str += `
总价：${totalPrice}元`

      wx.setClipboardData({
        data: str,
      })
    }
  },

  // 展示详情半页框
  showDetailPannel: function (e) {
    let item = e.currentTarget.dataset.item;
    console.log(item)
    item.fishDetailSizeIndex = item.fishDetailSizeIndex || 0;
    item.fishDetailAppearanceIndex = item.fishDetailAppearanceIndex || 0;
    this.setData({
      fishDetail: item
    })
  },

  //change size
  changeDetailSize: function (e) {
    let index = e.currentTarget.dataset.index;
    let detail = this.data.fishDetail

    detail.fishDetailSizeIndex = index;
    this.setData({
      fishDetail: detail
    })
  },

  //change appearance
  changeDetailAppearance: function (e) {
    let index = e.currentTarget.dataset.index;
    let detail = this.data.fishDetail

    detail.fishDetailAppearanceIndex = index;
    this.setData({
      fishDetail: detail
    })
  },
})