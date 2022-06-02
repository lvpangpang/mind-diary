const { request } = require("../../utils/index");
const app = getApp();
let id = null;

Page({
  data: {
    detail: {},
    comment: [],
    selectUser: null,
    showComment: false,
  },

  onLoad(option) {
    id = option.id;
    this.getData();
    this.getComment();
  },

  show(option) {
    if (!wx.getStorageSync("token")) {
      this.getUserProfile();
      return;
    }
    const { id, name } = option.currentTarget.dataset;
    this.setData({
      showComment: true,
      selectUser: {
        id,
        name,
      },
    });
  },
  close() {
    this.setData({
      showComment: false,
    });
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
        }
      },
    });
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

  async getComment() {
    try {
      wx.showLoading({
        title: "疯狂请求中",
      });
      const data = await request({
        url: "/comment/get",
        data: {
          id,
        },
      });

      this.setData({
        comment: data || [],
      });
    } finally {
      wx.hideLoading();
    }
  },

  async save(e) {
    const content = e.detail;
    const selectUser = this.data.selectUser;
    try {
      wx.showLoading({
        title: "疯狂请求中",
      });
      await request({
        method: "POST",
        url: "/comment/add",
        data: {
          id,
          content,
          replyId: selectUser.id || null,
        },
      });
      this.setData({
        showComment: false,
      });
      wx.showToast({
        title: "添加成功",
      });
      this.getComment();
    } finally {
      wx.hideLoading();
    }
  },
});
