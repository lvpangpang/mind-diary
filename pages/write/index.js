const { request, getDomain } = require("../../utils/index");
let richText = null; //富文本编辑器实例
let from = "index";

Page({

  //编辑器初始化完成时触发，可以获取组件实例
  onEditorReady() {
    console.log("[onEditorReady callback]");
    richText = this.selectComponent("#richText"); //获取组件实例
  },

  //插入图片
  insertImageEvent() {
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      success: (res) => {
        let path = res.tempFilePaths[0];
        wx.showLoading({
          title: "疯狂上传中",
        });
        wx.uploadFile({
          url: getDomain() + "/upload",
          filePath: path,
          name: "files",
          success(res) {
            wx.hideLoading();
            const result = JSON.parse(res.data);
            let { code, data } = result;
            if (code === 200) {
              let urlList = data;
              richText.insertImageMethod(urlList[0]["url"]);
            } else {
              wx.showLoading();
              wx.showToast({
                icon: "error",
                title: "上传图片失败",
              });
            }
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
          url: from === 'index' ? "/diary/add": '/community/add',
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

  onLoad(options) {
    from = options.from
  },
});
