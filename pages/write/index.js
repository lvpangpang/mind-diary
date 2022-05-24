const { request } = require("../../utils/index");
const app = getApp();
const fileManager = wx.getFileSystemManager();
let richText = null; //富文本编辑器实例

Page({
  data: {
    statusBarHeight: 20,
  },

  goBack() {
    wx.navigateBack();
  },

  //编辑器初始化完成时触发，可以获取组件实例
  onEditorReady() {
    console.log("[onEditorReady callback]");
    richText = this.selectComponent("#richText"); //获取组件实例
  },

  //插入图片
  insertImageEvent() {
    wx.chooseImage({
      count: 1,
      sizeType: ["original"],
      success: (res) => {
        let path = res.tempFilePaths[0];
        // 暂时先转为base64插入数据库
        let base64 =
          "data:image/jpg;base64," + fileManager.readFileSync(path, "base64");
        richText.insertImageMethod(base64);
      },
    });
  },

  async getEditorContent(data) {
    const content = data.detail.value.html;
    if (content !== "<p><br></p>") {
      try {
        wx.showLoading();
        await request({
          method: "POST",
          url: "/diary/add",
          data: {
            content,
          },
        });
        wx.showToast({
          title: "保存成功",
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 300);
      } finally {
        wx.hideLoading();
      }
    } else {
      wx.showToast({
        icon: "error",
        title: "请输入内容",
      });
    }
  },

  onLoad() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          statusBarHeight: res.statusBarHeight,
        });
      },
    });
  },
});
