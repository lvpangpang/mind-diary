const app = getApp();

Page({
  data: {
  },

  goWrite() {
    wx.navigateTo({
      url: "/pages/write/index"
    })
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
