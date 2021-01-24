Page({

  /**
   * 页面的初始数据
   */
  data: {
    forms: [
      {
        id: 1,
        county: '巴中市恩阳区烟草专卖局',
        date: '2021-11-12',
        user: 'xxx'
      },
      {
        id: 2,
        county: '巴中市恩阳区烟草专卖局',
        date: '2021-11-13',
        user: 'xxxccc'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  addData(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/scan-result/scan-result?id=${item.id}`
    })
  },
  editForm(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/add-form/add-form?id=${item.id}`
    })
  },
  addForm() {
    wx.navigateTo({
      url: `/pages/add-form/add-form`
    })
  }
})