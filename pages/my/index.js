const app = getApp();

Page({
  data: {
    motto: "Hello World",
  },

  onLoad() {
  },

  // 获取用户信息
  getUserProfile(e) {
    wx.getUserProfile({
      desc: "用于完善会员资料",
      success: (res) => {
        console.log(res);
      },
    });
  },
});
