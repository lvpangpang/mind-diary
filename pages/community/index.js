const { request } = require("../../utils/index");
const app = getApp();

Page({
  data: {
    list: [],
    total: 0
  },

  onShow() {
    this.getData();
  },

  async getData() {
    try {
      wx.showLoading({
        title: "疯狂请求中",
      });
      const data = await request({
        url: "/community/get",
        data: {
          pageIndex: 1,
        },
      });
      const { list, total, num } = data;
      list.forEach((item) => {
        item.content = item.content.replace(
          /\<img/gi,
          '<img style="max-width:100%;height:auto"'
        );
      });
      this.setData({
        list,
        total
      });
    } finally {
      wx.hideLoading();
    }
  },
});
