import { list } from '../../utils/doc.js'
import {baseUrl} from "../../config/dev";

Page({
  data: {
    searchValues:[],
    inputValue: '',
    loading: false
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '搜索法条'
    })
  },

  onConfirm(e) {
    const value = e.detail.value
    this.setData({
      inputValue: value
    })
    this.searchValue(value)
  },

  onInput(e) {
    const value = e.detail.value
    this.setData({
      inputValue: value
    })
  },

  search() {
    this.searchValue(this.data.inputValue)
  },
  searchFromApi() {
    wx.request({
      url: `${baseUrl}/smoke/fileSearch/search`,
      data: {
        keyWord: "行政机关",
        pageSize: 10,
        pageIndex: 1
      },
      success: (res) => {
        console.log(res)
      }
    })
  },
  searchValue(searchValue) {
    wx.showLoading({
      title: '搜索中，请稍后'
    })
    this.setData({
      loading: true
    })
    const searchValueKeyWord = searchValue.trim()
    const values = []
    const allKeys = Object.keys(list)
    allKeys.forEach((key) => {
      if (list[key].length) {
        const otherDocValues = list[key]
        const otherValues = []
        otherDocValues.forEach(item => {
          if (item.indexOf(searchValueKeyWord) !== -1) {
            const highlightLabel = "<span class=\"highLight\">" + searchValueKeyWord + "</span>"
            const highlightItem = item.replace(searchValueKeyWord, highlightLabel)
            otherValues.push(highlightItem)
          }
        })

        if(otherValues.length) {
          values.push({
            title: key,
            value: otherValues
          })

        }

      }
    })

    setTimeout(() => {
      this.setData({
        searchValues: values,
        loading: false
      })
      wx.hideLoading()
    }, 1000)


  },



})