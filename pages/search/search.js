import {baseUrl} from "../../config/dev";

Page({
  data: {
    searchValues:[],
    inputValue: '',
    loading: false,
    pager: {
      total: 5,
      pageSize: 100,
      current: 1
    },
    scrollTop: 0,
    height: 0
  },
  onLoad: function () {


  },

  onReady() {
    const { windowWidth, windowHeight } = wx.getSystemInfoSync()

    const query = this.createSelectorQuery()
    query
        .select('.footer')
        .boundingClientRect((element) => {
          if(!element) {
            return
          }
          const scale =  windowWidth / 750
          this.setData({
            height: windowHeight - element.height - 72 * scale
          })
        })
        .exec()
  },

  onConfirm(e) {
    const value = e.detail.value
    this.setData({
      inputValue: value
    })
    this.searchFromApi(1, value)

  },

  onInput(e) {
    const value = e.detail.value
    this.setData({
      inputValue: value
    })
  },

  search() {
    this.searchFromApi(1, this.data.inputValue)
  },
  searchFromApi(currentPage, searchValueKeyWord) {
    this.setData({
      scrollTop: 0
    })
    wx.showLoading({
      title: '正在加载'
    })
    wx.request({
      url: `${baseUrl}/smoke/fileSearch/search`,
      data: {
        keyWord: searchValueKeyWord,
        pageSize: this.data.pager.pageSize,
        current: currentPage
      },
      success: (res) => {
        const { data, code, message } = res.data;
        wx.hideLoading();
        if (code === 200 && data) {
            const list = data.list;
            const formatList =  list.map(item => {
              if (item.word_content.indexOf(searchValueKeyWord) !== -1) {
                const highlightLabel = "<span class=\"highLight\">" + searchValueKeyWord + "</span>"
                const highlightItem = item.word_content.replace(searchValueKeyWord, highlightLabel)
                return {
                  ...item,
                  word_content: highlightItem
                }
              } else {
                return item
              }
            })

            const values = this.getNew(formatList)
            this.setData({
              searchValues: values,
              pager: {
                ...this.data.pager,
                current: data.current,
                pageSize: data.pageSize,
                total: data.total
              }
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
  getNew(beforeData){
    let tempArr = [];
    const afterData = [];
    for (let i = 0; i < beforeData.length; i++) {
      if (tempArr.indexOf(beforeData[i].word_name) === -1) {
        afterData.push({
          word_name: beforeData[i].word_name,
          origin: [beforeData[i]]
        });
        tempArr.push(beforeData[i].word_name);
      } else {
        for (let j = 0; j < afterData.length; j++) {
          if (afterData[j].word_name == beforeData[i].word_name) {
            afterData[j].origin.push(beforeData[i]);
            break;
          }
        }
      }
    }
    return afterData
  },
  onPageChange(e){
    this.setData({
      pager: {
        ...this.data.pager,
        current: e.detail
      }
    });

    this.searchFromApi(e.detail, this.data.inputValue)
  },

})