const { request } = require("../../utils/index");
const app = getApp();

Page({
  data: {},

  goWrite() {
    if (wx.getStorageSync("token")) {
      wx.navigateTo({
        url: "/pages/write/index",
      });
    } else {
      this.getUserProfile();
    }
  },

  login(props) {
    wx.login({
      async success(res) {
        if (res.code) {
          const { token } = await request({
            method: "POST",
            url: "/login",
            data: {
              code: res.code,
              ...props,
            },
          });
          wx.setStorageSync("token", token);
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      },
    });
  },

  // 获取用户信息
  getUserProfile(e) {
    wx.getUserProfile({
      desc: "用于完善会员资料",
      success: (res) => {
        const { avatarUrl, nickName } = res.userInfo || {};
        this.login({
          avatarUrl,
          nickName,
        });
        console.log(res);
      },
    });
  },
});
