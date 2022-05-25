const { request } = require("../../utils/index");
const app = getApp();
const fileManager = wx.getFileSystemManager();
let richText = null; //富文本编辑器实例

const {
  miniProgram: { envVersion },
} = wx.getAccountInfoSync();

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
        wx.uploadFile({
          url:
            (envVersion === "develop"
              ? "http://10.16.20.9:7001"
              : "https://www.lvpangpang.com") + "/upload",
          filePath: path,
          name: "files",
          success(res) {
            const result = JSON.parse(res.data);
            const { data } = result;
            console.log(typeof result);
            console.log(result.data)
            richText.insertImageMethod(data[0]['url']);
          },
        });
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
