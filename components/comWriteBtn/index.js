const { request } = require("../../utils/index");
const app = getApp();

Component({
  properties: {
    // 跳转url
    url: {
      type: String,
      value: "",
    },
  },
  methods: {
    goWrite() {
      if (wx.getStorageSync("token")) {
        wx.navigateTo({
          url: this.properties.url
        });
      } else {
        this.getUserProfile();
      }
    },

    getUserProfile(e) {
      wx.getUserProfile({
        desc: "用于完善会员资料",
        success: (res) => {
          const { avatarUrl, nickName } = res.userInfo || {};
          this.login({
            avatarUrl,
            nickName,
          });
        },
      });
    },

    login(props) {
      const that = this;
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
            that.onShow();
          }
        },
      });
    },
  },
});
