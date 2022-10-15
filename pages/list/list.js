// pages/products/products.js
// https://github.com/vanclimber/MiniProgram-diancan/blob/master/app.wxss
// https://github.com/vanclimber/MiniProgram-diancan

// const mainUrl = 'http://localhost:3000/api/min'
const mainUrl = 'https://nbc.daijinma.cn/api/min'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [], //存放商品列表
    typeList: [],
    renderList: [],
    renderListPrice: [],
    renderListCategory: [],
    originList: [],
    shoppingCart: [],
    titleTopList: [],
    totalPrice: 0,
    showCartDetail: false,
    fishDetail: {},
    totalNumber: 0,
    rpxToPx: 2,
    menuIndex: 0,
    desc: '',
    current: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFish()
    this.getDesc()

    // rpx和px进行转换
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          rpxToPx: res.screenWidth / 750
        })
      }
    });

  },
  changeCurrent(e) {
    let current = e.currentTarget.dataset.current;

    this.setData({
      current
    })
  },
  getDesc() {
    return wx.request({
      url: mainUrl + '/config/desc',
      method: 'GET',
      success: ({
        data: {
          desc
        }
      }) => {
        this.setData({
          desc
        })
      },
      fail: function () {
        this.setData({
          desc: '只接受签收后两小时内开箱视频报损，运费包装费不报损，三天以内发货，鱼有白点可发送清晰视频报损，飞碟虫不报损，客户可自行处理一下，过淡水三到五分钟即可'
        })
      }

    })
  },

  getFish() {
    wx.showLoading({
      title: '正在努力加载中',
    })
    return wx.request({
      url: mainUrl + '/products/v2/all',
      method: 'GET',
      success: ({
        data
      }) => {
        wx.hideLoading();

        const list = [];
        const list_id = [];
        data.list.forEach(item => {
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
          if (index >= 0) {
            list[index].size.push(current_size)
            list[index].appearance.push(current_appearance)
            list[index].detail.push(item)
          } else {
            list_id.push(fish_id)
            list.push({
              fish_id,
              fish_name,
              category,
              fish_image_url,
              size: [current_size],
              appearance: [current_appearance],
              detail: [item]
            })
          }
        });

        // 默认排序，内部按价格排序
        list.forEach(item => {
          item.detail = item.detail.sort((a, b) => {
            return a.price - b.price
          })
        })

        // 整体按价格排序，比较首个子项 价格
        const listPrice = [...list].sort((a, b) => {
          return a?.detail[0]?.price - b?.detail[0]?.price;
        })

        // 按分类排序
        const listCategory = [];
        const listCategoryName = [];
        list.forEach(item => {
          const category = item.category;
          const index = listCategoryName.indexOf(category)
          if (index > -1) {
            listCategory[index].list.push(item)
          } else {
            listCategoryName.push(category)
            listCategory.push({
              key: category,
              list: [item]
            })
          }
        })


        this.setData({
          renderList: [{
            key: '商品列表',
            list: list,
          }],
          renderListPrice: [{
            key: '商品列表',
            list: listPrice,
          }],
          renderListCategory: listCategory,
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
      totalPrice: this.data.totalPrice + 1 * (Number(fishDetail.price[fishDetail.fishDetailSizeIndex] || 0)),
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
      totalPrice: this.data.totalPrice + num * (Number(item.price[item.fishDetailSizeIndex] || 0)),
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
        var str_1 = `
${item.fish_name}/${item.supplier||''}
  规/品：${item.size[item.fishDetailSizeIndex] || ""} / ${item.appearance[item.fishDetailAppearanceIndex] || ""} 
  价格：${(Number(item.price[item.fishDetailSizeIndex] || 0))} * ${item.number || 1}
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
    let index = e.currentTarget.dataset.index;

    item.fishDetailSizeIndex = index || item.fishDetailSizeIndex || 0;
    item.fishDetailAppearanceIndex = index || item.fishDetailAppearanceIndex || 0;
    item.price = item.detail.map(a => a.price).filter(b => !!b)
    item.size = item.detail.map(a => a.current_size).filter(b => !!b)
    item.appearance = item.detail.map(a => a.appearance).filter(b => !!b)
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