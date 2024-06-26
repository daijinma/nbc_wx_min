// pages/products/products.js
// https://github.com/vanclimber/MiniProgram-diancan/blob/master/app.wxss
// https://github.com/vanclimber/MiniProgram-diancan

// const mainUrl = 'http://localhost:3000/api/min'
const mainUrl = 'https://nbc.daijinma.cn/api/min'
const app = getApp()

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
    user: {
      is_staff: false,
      avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFish()
    // this.getDesc()


    // rpx和px进行转换
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          rpxToPx: res.screenWidth / 750
        })
      }
    });

    app.getGlobal()
      .then(res => {
        this.setData({
          user: {
            is_staff: !!res?.nbcInfo?.mobile,
            ...res?.nbcInfo
          },
        })

        // this.getMockPrice()
      })

  },
  onShow() {
    this.getMockPrice()
  },
  hideStaff() {
    this.setData({
      user: {
        is_staff: false
      }
    })
  },
  openModal: function() {
    wx.setStorage({
      key: "qrcode_show",
      data: "1",
    })
    wx.previewImage({
      current: "https://nbc-static.oss-cn-beijing.aliyuncs.com/nbc_banner.jpeg", // 当前显示图片的http链接
      urls: ['https://nbc-static.oss-cn-beijing.aliyuncs.com/nbc_banner.jpeg']
    })

  },
  getMockPrice() {

    app.getGlobal()
      .then((res) => {
        if (!res.nbcInfo) return
        const {
          nbcInfo: {
            openid = ''
          } = {},
          config: {
            mockValue = true
          } = {}
        } = res

        this.setData({
          mockValue: mockValue
        }, () => {
          this.getFish()
        })

      })
  },

  jumpUserCenter() {
    wx.navigateTo({
      url: '../user/user'
    })
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

        // if (!this.data.user.is_staff || this.data.mockValue) {
        //   data.list.forEach((item) => {
        //     item.price = Math.round(parseInt(item.price * 1.1) / 5) * 5;
        //   })
        // }

        const list = [];
        const list_id = [];
        const discount_list = data.list.map(item => {
          if (item.discount) {
            return {
              ...item,
              "category": "特价区",
            }
          }
          return null;
        }).filter(i => !!i)

        data.list.unshift(...discount_list);

        data.list.forEach(item => {
          const id = `${item.fish_id}_${item.price}`;
          item._id = id;
          const {
            fish_id,
            fish_name,
            category,
            fish_image_url,
            current_size,
            current_appearance
          } = item;
          const __id = `${category}_${fish_id}`
          const index = list_id.indexOf(__id)
          if (index >= 0) {
            list[index].size.push(current_size)
            list[index].appearance.push(current_appearance)
            list[index].detail.push(item)
          } else {
            list_id.push(__id)
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
      const current = list[index];
      const _id1 = `${item.fish_id}_${item.fishDetailAppearanceIndex}_${item.fishDetailSizeIndex}`
      const _id2 = `${current.fish_id}_${current.fishDetailAppearanceIndex}_${current.fishDetailSizeIndex}`
      if (_id1 === _id2) {
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
      let count = 0;
      shoppingCart.forEach(item => {
        const i = item.fishDetailSizeIndex;
        const num = item.detail[i].num;
        var str_1 = `${item.fish_name}(${item.size[item.fishDetailSizeIndex] || ""}/${item.appearance[item.fishDetailAppearanceIndex] || ""}) = ${(Number(item.price[item.fishDetailSizeIndex] || 0))}*${item.number || 1} ${num<item.number?'缺货':''}
`
        str += str_1;
        count += item.number || 1
      })
      const all = this.elseCount(count)
      str += `
鱼价：${totalPrice}元
打包快递：${all}元
总价：${totalPrice + all}元
(有大鱼不走小包装，量大运费单独计算)${(this.data.user.is_staff && !this.data.mockValue)?`
渔场：${totalPrice*0.7}+${all}=${totalPrice*0.7+all}`:''}
`


      wx.setClipboardData({
        data: str,
      })
    }
  },

  elseCount(num) {
    let all = 0;

    function count(_num) {
      if (_num < 4) {
        all += 40
      } else if (_num < 9) {
        all += 50
      } else if (_num < 16) {
        all += 70
      } else if (_num < 26) {
        all += 100
      } else {
        all += 100 // 超过单个箱子+快递，起算第二次快递
        count(_num - 25)
      }
    }

    count(num)

    return all
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

  onShareAppMessage: function (res) {},
  onShareTimeline: function (res) {}

})