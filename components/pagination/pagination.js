// components/pagination/pagination.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    total: {
      type: Number
    },
    pageSize: {
      type: Number
    },
    current: {
      type: Number
    }

  },

  observers:  {
    'total, pageSize': function (total, pageSize) {
      if(total && pageSize) {
        this.setData({
          pageCount: Math.ceil(total/pageSize)
        })
      }
    }
  },

  data: {
    pageCount: 0
  },

  methods: {
    prevPage() {
      if(this.data.current > 1) {
        this.triggerEvent('onPageChange', this.data.current - 1)
      }
    },
    nextPage() {
      if(this.data.current < this.data.pageCount) {
        this.triggerEvent('onPageChange', this.data.current + 1)
      }
    }
  }
})
