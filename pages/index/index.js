//index.js
//获取应用实例
import { baseUrl } from "../../config/dev";

const app = getApp()

Page({
  data: {
    checkedList: [],
    checkboxOption: [],
    downloadLoading: false,
    removeLoading: false,
    pager: {
      total: 5,
      pageSize: 10,
      current: 1
    },
    dataList: []
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getCheckboxOption()
  },
  getCheckboxOption(currentPage, pageSize, qrCodeUrl){
    wx.showLoading({
      title: '正在加载'
    });
    wx.request({
      url: `${baseUrl}/smoke/init/getQrCodeList`,
      data: {
        current: currentPage,
        pageSize,
        qrCodeUrl: qrCodeUrl
      },
      success: (res) => {
        const { data, code, message } = res.data;
        if (code === 200 && data) {
          const { list, current, pageSize, total } = data;
          this.setData({
            checkboxOption: getOptionFromProduct(list),
            pager: {
              total,
              current,
              pageSize
            }
          })
        } else if (code === 400) {
          wx.showToast({
            title: message
          })
        }
      },
      fail() {
        wx.showToast({
          title: '请求失败'
        })
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  handleChange(e){
    const value = e.currentTarget.dataset.value;

    const { checkedList } = this.state;
    let tempCheckedList = checkedList;

    const valueIndex = tempCheckedList.findIndex((item) => item === value);
    if ( valueIndex !== -1) {
      this.setData({
        checkedList: tempCheckedList.filter(item => item !== value)
      })
    } else {
      tempCheckedList.push(value);
      this.setData({
        checkedList: tempCheckedList
      })
    }

  },

  downloadExcel(){
    this.setData({
      downloadLoading: true
    });
    wx.showLoading({
      title: '正在下载'
    });
    const { checkedList } = this.state;
    const encodeUrls = checkedList.map((item) => encodeURIComponent(item))
    const qrCodeUrls = encodeUrls.join(',');
    wx.downloadFile({
      url: `${baseUrl}/smoke/init/downSmokeData?qrCodeUrls=${qrCodeUrls}`,
      success: (res) => {
        if (res.statusCode === 200) {
          const filePath = res.tempFilePath;
          wx.openDocument({
            filePath: filePath,
            showMenu: true,
            fileType: 'xls',
            success: function () {
              console.log('打开文档成功')
            }
          });
          this.setData({
            downloadLoading: false
          })
        }
      },
      complete() {
        wx.hideLoading()
      }
    })

  },

  remove(){
    this.setData({
      removeLoading: true
    });

    const { checkedList } = this.state;
    const encodeUrls = checkedList.map((item) => encodeURIComponent(item))

    const qrCodeUrls = encodeUrls.join(',');
    wx.request({
      url: `${baseUrl}/smoke/init/deleteSmoke?qrCodeUrls=${qrCodeUrls}`,
      method: 'POST',
      success: (res) => {
        if (res.data.code === 200) {
          this.getCheckboxOption(1, this.state.pager.pageSize);
          this.setData({
            checkedList: []
          })
        }
      }
    })

  },

  selectAll() {
    const { checkboxOption } = this.state;
    this.setData({
      checkedList: checkboxOption.map((item) => item.value)
    })
  },

  cancelSelectAll () {
    this.setData({
      checkedList: []
    })
  },

  onPageChange(value){
    this.setData({
      pager: {
        ...this.state.pager,
        current: value.current
      }
    });
    this.getCheckboxOption(value.current, this.state.pager.pageSize)
  },
  handleClick(){
    wx.scanCode({
      success: (res) => {
        this.getCheckboxOption(this.state.pager.current, this.state.pager.pageSize, res.result);
      }
    })
  }
})
