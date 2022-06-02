const app = getApp();

Component({
  properties: {
    placeholder: {
      type: String,
      value: "",
    }
  },
  data: {
    value: "",
  },
  methods: {
    setValue(e) {
      const value = e.detail.value;
      this.setData({
        value,
      });
    },
    close() {
      this.triggerEvent("close");
    },
    save() {
      const value = this.data.value;
      if (!value) {
        wx.showToast({
          title: "请输入评论",
          type: "error",
        });
        return;
      }
      this.triggerEvent("save", value);
      this.setData({
        value: "",
      });
    },
  },
});
