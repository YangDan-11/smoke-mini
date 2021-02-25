import {baseUrl} from "../../config/dev";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    forms: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    this.getList()
  },
  getList() {
    wx.showLoading({
      title: '正在加载'
    })
    wx.request({
      url: `${baseUrl}/smoke/table/getTableList`,
      data: {
        current: 1,
        pageSize: 999
      },
      success: (res) =>{
        const { data, code, message } = res.data;
        wx.hideLoading();
        if (code === 200 && data) {
          const list = data.list;
          this.setData({
            forms: list
          })
        } else if (code === 400) {
          wx.showToast({
            title: message,
            icon: 'error',
            duration: 2000
          })
        }
      },
      fail() {
        wx.hideLoading();

        wx.showToast({
          title: '请求失败',
          icon: 'error'
        })
      }
    })
  },

  addData(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/scan-result/scan-result?id=${item.guid}`
    })
  },
  editForm(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/add-form/add-form?id=${item.guid}`
    })
  },
  addForm() {
    wx.navigateTo({
      url: `/pages/add-form/add-form`
    })
  },
  remove(e){
    const item = e.currentTarget.dataset.item
    wx.showModal({
      title: "删除表格",
      content: "确定删除表格",
      success: (res) => {
        if(res.confirm) {
          wx.request({
            url: `${baseUrl}/smoke/table/deleteTable?guid=${item.guid}`,
            method: 'POST',
            success: (res) => {
              if(res.data.code === 200) {
                this.getList()
                wx.showToast({
                  title: "删除成功"
                })
              }
            }
          })
        }
      }
    })
  }
})