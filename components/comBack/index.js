Component({
  data: {
    statusBarHeight: 20,
  },
  ready() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          statusBarHeight: res.statusBarHeight,
        });
      },
    });
  },
  methods: {
    goBack() {
      wx.navigateBack();
    },
  },
});
