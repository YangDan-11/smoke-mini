// pages/home/home.js
Page({

  onShareAppMessage: function () {
    return {
      title: '首页',
      path: `/pages/landing/landing`,
    };
  },

  jumpToScan() {
    wx.navigateTo({
      url:"/pages/scan/scan"
    })
  },

  jumpToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  }
})