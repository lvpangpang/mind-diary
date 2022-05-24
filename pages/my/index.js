const { request } = require("../../utils/index");

const app = getApp();

Page({
  data: {
    user: {},
  },

  async onShow() {
    if (wx.getStorageSync("token")) {
      const data = await request({
        url: "/user/getUser",
      });
      this.setData({
        user: data,
      });
    }
  },
});
