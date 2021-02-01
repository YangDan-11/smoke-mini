import {baseUrl} from "../../config/dev";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    countyList: ["巴中市巴州区烟草专卖局",
      "巴中市恩阳区烟草专卖局",
      "巴中市通江县烟草专卖局",
      "巴中市南江县烟草专卖局",
      "巴中市平昌县烟草专卖局"],
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
      })

      this.getTableData(options.id)
      wx.setNavigationBarTitle({
        title: "编辑表格"
      })
    } else {
      wx.setNavigationBarTitle({
        title: "新建表格"
      })
    }
  },

  getTableData(id) {
    wx.request({
      url: `${baseUrl}/smoke/table/getTableInfo?guid=${id}`,
      success:(res) => {
        const { data, code } = res.data;
        if (code === 200 && data) {
          this.setData({
            county: data.area,
            date: data.createTime,
            user: data.owner
          })
        }
      }
    })
  },

  bindPickerChange(e) {
    const county = this.data.countyList[e.detail.value]
    this.setData({
      county: county,
    })
  },
  bindTimeChange(e) {
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

    this.setData({
      buttonDisable: true
    })
    let url;
    if(this.data.id) {
      url = `/smoke/table/changeTable?area=${county}&date=${date}&owner=${user}&guid=${this.data.id}`
    } else {
      url = `/smoke/table/saveTable?area=${county}&date=${date}&owner=${user}`
    }

    wx.request({
      url: `${baseUrl}${url}`,
      method: 'POST',
      success: (res) => {
        if(res) {
          wx.navigateBack()
        }
      },
      complete:()=> {
        this.setData({
          buttonDisable: false
        })
      }
    })

  }
})