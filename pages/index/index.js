const { request } = require("../../utils/index");
const app = getApp();

const pageSize = 10;

Page({
  data: {
    top: [],
    list: [],
    total: 0,
    pageIndex: 1,
    isAjax: false,
    isBottom: false,
  },

  onShow() {
    this.setData({
      list: [],
      total: 0,
      pageIndex: 1,
    });
    wx.showLoading({
      title: "疯狂请求中",
    });
    this.getData();
    this.getTop();
  },

  onReachBottom() {
    const { total, pageIndex, isAjax } = this.data;
    if (!isAjax && pageIndex * pageSize < total) {
      this.setData({
        pageIndex: this.data.pageIndex + 1,
      });
      this.getData();
    } else {
      this.setData({
        isBottom: true,
      });
    }
  },

  async getData() {
    try {
      this.setData({
        isAjax: true,
      });
      const { pageIndex } = this.data;
      const data = await request({
        url: "/community/get",
        data: {
          pageIndex,
        },
      });
      const { list, total } = data;
      list.forEach((item) => {
        item.content = item.content.replace(
          /\<img/gi,
          '<img style="max-width:100%;height:auto"'
        );
      });
      this.setData({
        list: this.data.list.concat(list),
        total,
      });
      if (pageIndex * pageSize >= total) {
        this.setData({ isBottom: true });
      }
    } finally {
      wx.hideLoading();
      this.setData({
        isAjax: false,
      });
    }
  },

  async getTop() {
    const data = await request({
      url: "/community/getTop",
    });
    const { list } = data;
    list.forEach((item) => {
      item.content = item.content.replace(
        /\<img/gi,
        '<img style="max-width:100%;height:auto"'
      );
    });
    this.setData({
      top: list
    });
  },
});
