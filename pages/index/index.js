//index.js
//获取应用实例
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
      pageSize: 1,
      current: 1
    },
    qrCodeList: [{
      qrcodeUrl: '12222',
      productName: 'test',
      codeSegment: '233333'
    },
      {
        qrcodeUrl: '12223',
        productName: 'test2',
        codeSegment: '233333nnnn<br />444444'
      }
    ]
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '首页'
    })
    this.setData({
      checkboxOption: getOptionFromProduct(this.data.qrCodeList)
    })
    // this.getCheckboxOption()
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
            qrCodeList: list,
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
  checkboxChange(e) {
    console.log(e)
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

    const qrCodeUrls = encodeUrls.join(',');
    wx.request({
      url: `${baseUrl}/smoke/init/deleteSmoke?qrCodeUrls=${qrCodeUrls}`,
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
  }
})
