// pages/landing/landing.js
Page({
  load() {
    setTimeout(() => {
      wx.reLaunch({
        url: '/pages/home/home'
      })
    },3000)
  },

})