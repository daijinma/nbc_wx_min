// pages/products/products.js
import {
  debounce
} from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [], //存放商品列表
    typeList: [],
    renderList: [],
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
    this.getCategory(() => {
      this.getFish()
    })

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
      url: 'https://nbc.daijinma.cn/api/min/products/all?orderby=cid&page=1&size=1000',
      method: 'GET',
      success: ({
        data
      }) => {
        wx.hideLoading();
        let goodsList = data.list;

        const newArr = this.data.typeList.map(function (category) {
          category.children = goodsList.filter(function (item) {
            return item.cid === category.id
          })
          return category;
        })
        this.setData({
          renderList: newArr,
          goodsList: goodsList,
        })

        setTimeout(() => {
          wx.createSelectorQuery().selectAll(".item-title").boundingClientRect().exec(res => {
            if (res[0].length) {
              let titleTopList = res[0].map(node => ({
                top: node.top,
                id: node.dataset.cid
              }))
              this.setData({
                titleTopList
              })
            }

          })
        }, 100)
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

  getCategory(cb) {
    wx.showLoading({
      title: '正在努力加载中',
    })
    return wx.request({
      url: 'https://nbc.daijinma.cn/api/min/products/category?page=1&size=200',
      method: 'GET',
      success: ({
        data
      }) => {
        wx.hideLoading();
        let typeList = data.list;
        this.setData({
          typeList: typeList,
          menuIndex: typeList[0].id
        })

        cb()
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
  // 点击左侧联动右侧
  selectMenu: function (event) {
    const {
      dataset: {
        cid = 0
      } = {}
    } = event.currentTarget
    let goodsList = this.data.goodsList;
    let id;
    for (let i in goodsList) {
      if (cid == goodsList[i].cid) {
        id = goodsList[i].id;
        break;
      }
    }
    this.setData({
      menuIndex: cid,
      contentView: 'title' + id,
    })
  },
  // 滑动右侧联动左侧
  scrollContent: debounce(function (e) {
    // let rpxToPx = this.data.rpxToPx;
    let scrollHeight = e.detail.scrollTop;
    let titleTopList = this.data.titleTopList;
    for (let index = 0; index < titleTopList.length; index++) {
      const catItem = titleTopList[index];
      const catItemNext = titleTopList[index + 1];
      if (catItem.top <= scrollHeight && catItemNext.top > scrollHeight || !catItemNext) {
        let cid = catItem.id

        this.setData({
          menuView: 'menu' + cid,
          menuIndex: cid,
        })
        break;
      }

    }

  }, 100),

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