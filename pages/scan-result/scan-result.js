import { baseUrl } from "../../config/dev";
import { getOptionFromProduct } from "../../utils/util";

Page({
  data: {
    checkedList: [],
    checkboxOption: [],
    downloadLoading: false,
    removeLoading: false,
    pager: {
      total: 5,
      pageSize: 500,
      current: 1
    },
    tableGuid: 0,
    qrCodeList: []
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      tableGuid: options.id
    })
    this.getCheckboxOption(1, this.data.pager.pageSize)
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
        qrCodeUrl: qrCodeUrl,
        tableGuid: this.data.tableGuid
      },
      success: (res) => {
        const { data, code, message } = res.data;
        wx.hideLoading();

        if (code === 200 && data) {
          const { list, current, pageSize, total } = data;
          this.setData({
            checkboxOption: getOptionFromProduct(list),
            qrCodeList: list,
            pager: {
              total,
              current,
              pageSize
            },
            checkedList: []
          })
        } else if (code === 400) {
          wx.showToast({
            title: message,
            icon: 'info',
            duration: 2000
          })
        }
      },
      fail() {
        wx.hideLoading();

        wx.showToast({
          title: '请求失败'
        })
      }
    })
  },
  checkboxChange(e) {
    const values = e.detail.value;
    this.setData({
      checkedList: values,
      checkboxOption: this.data.checkboxOption.map((item) => {
        return {
          ...item,
          checked: values.findIndex(checkedItem => checkedItem === item.value) !== -1
        }
      })
    })
  },

  downloadExcel(){
    this.setData({
      downloadLoading: true
    });
    wx.showLoading({
      title: '正在下载'
    });
    const { checkedList } = this.data;
    const encodeUrls = checkedList.map((item) => encodeURIComponent(item))
    wx.downloadFile({
      url: `${baseUrl}/smoke/init/downSmokeData?qrCodeUrls=${encodeUrls}&tableGuid=${this.data.tableGuid}`,
      filePath: wx.env.USER_DATA_PATH+ '/test.xls',
      success: (res) => {
        if (res.statusCode === 200) {
          const filePath = res.filePath;
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
      fail: () => {
        wx.showToast({
          title: '请求失败'
        })
      },
      complete: () => {
        this.setData({
          downloadLoading: false
        })
        wx.hideLoading()
      }
    })

  },

  remove(){
    this.setData({
      removeLoading: true
    });

    const { checkedList } = this.data;
    const encodeUrls = checkedList.map((item) => encodeURIComponent(item))
    wx.request({
      url: `${baseUrl}/smoke/init/deleteSmoke`,
      data: {
        qrCodeUrls: encodeUrls,
        tableGuid: this.data.tableGuid
      },
      method: 'POST',
      success: (res) => {
        if (res.data.code === 200) {
          this.getCheckboxOption(1, this.data.pager.pageSize);
          this.setData({
            checkedList: []
          })
        }
      }
    })

  },

  selectAll() {
    const { checkboxOption } = this.data;
    this.setData({
      checkedList: checkboxOption.map((item) => item.value),
      checkboxOption: checkboxOption.map((item) => {
        return {
          ...item,
          checked: true
        }
      })
    })
  },

  cancelSelectAll () {
    const { checkboxOption } = this.data;
    this.setData({
      checkedList: [],
      checkboxOption: checkboxOption.map((item) => {
        return {
          ...item,
          checked: false
        }
      })
    })
  },

  onPageChange(e){
    this.setData({
      pager: {
        ...this.data.pager,
        current: e.detail
      }
    });
    this.getCheckboxOption(e.detail, this.data.pager.pageSize)
  },
  handleClick(){
    wx.scanCode({
      success: (res) => {
        this.getCheckboxOption(this.data.pager.current, this.data.pager.pageSize, res.result);
      }
    })
  },
  search() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  }
})
