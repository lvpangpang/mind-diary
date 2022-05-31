const { request } = require("../../utils/index");
const app = getApp();
let id = null;
Page({
  data: {
    detail: {},
    content: "",
  },

  onLoad(option) {
    id = option.id;
    this.getData();
  },

  async getData() {
    try {
      wx.showLoading({
        title: "疯狂请求中",
      });
      const data = await request({
        url: "/community/getOne",
        data: {
          id,
        },
      });

      data.content = data.content.replace(
        /\<img/gi,
        '<img style="max-width:100%;height:auto"'
      );

      this.setData({
        detail: data || {},
      });
    } finally {
      wx.hideLoading();
    }
  },

  async add() {
    const content = this.data.content;
    if (!content) {
      wx.showToast({
        title: "请输入评论",
        type: 'error'
      });
      return;
    }
    try {
      wx.showLoading({
        title: "疯狂请求中",
      });
      await request({
        method: "POST",
        url: "/comment/add",
        data: {
          id,
          content: this.data.content,
        },
      });
      wx.showToast({
        title: "添加成功",
      });
      this.setData({
        content: "",
      });
    } finally {
      wx.hideLoading();
    }
  },
});
