// 获取当前页面实例
function getContext() {
  const pages = getCurrentPages();
  return pages[pages.length - 1];
}
// 控制弹窗显隐方法
export function showLoginDialog(options={}) {
  wx.$event.emit("loginDialogShow", options)
}

// 刷新当前页面
export function refreshPage() {
  const perpage = getContext()
  const keyList = Object.keys(perpage.options)
  if (keyList.length > 0) {//页面携带参数
    let keys = '?'
    keyList.forEach((item, index) => {
      index === 0 ? keys = keys + item + '=' + perpage.options[item] : keys + '&' + item + '=' + perpage.options[keys]
    })
    wx.reLaunch({
      url: '/' + perpage.route + keys
    })
  } else {//页面没有携带参数
    perpage.onLoad()
    // 也可以使用wx.reLaunch
  }
}

export function navigateTo(url='/index/index') {
  wx.navigateTo({
    url: url,
    success: function(){
    },
    fail: function(e){
      console.log(e)
    },
    complete: function(){
    }
  })

  
}