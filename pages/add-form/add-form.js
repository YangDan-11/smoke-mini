const item =  {
      id: 1,
      county: '巴中市恩阳区烟草专卖局',
      date: '2021-11-12',
      user: 'xxx'
    }
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    countyList: ["巴中市恩阳区烟草专卖局", "巴中市xx区烟草专卖局"],
    county: '',
    date:'',
    user: '',
    buttonDisable: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        id: options.id,
        county: item.county,
        date: item.date,
        user: item.user
      })
      wx.setNavigationBarTitle({
        title: "编辑表格"
      })
    } else {
      wx.setNavigationBarTitle({
        title: "新建表格"
      })
    }
  },

  bindPickerChange(e) {
  console.log(e)
    const county = this.data.countyList[e.detail.value]
    this.setData({
      county: county,
    })
  },
  bindTimeChange(e) {
    console.log('date', e)
    this.setData({
      date: e.detail.value
    })
  },
  bindUserChange(e) {
    this.setData({
      user: e.detail.value
    })
  },
  confirm() {
    const {county,date, user} = this.data
    console.log(county,date, user)
  }
})