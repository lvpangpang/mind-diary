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
      sizeType: ['original'],
      success: (res) => {
        let path = res.tempFilePaths[0];
        // 暂时先转为base64插入数据库
        let base64 = 'data:image/jpg;base64,' + fileManager.readFileSync(path, 'base64')
        //调用子组件（富文本组件）方法，图片应先上传再插入，不然预览时无法查看图片。
        richText
          .insertImageMethod(base64)
          .then((res) => {
            console.log("[insert image success callback]=>", res);
          })
          .catch((res) => {
            console.log("[insert image fail callback]=>", res);
          });
      },
    });
  },

  getEditorContent(data) {
    wx.showToast({
      title: '保存成功'
    })
    setTimeout(() => {
      wx.navigateBack()
    }, 300)
    console.log(data)
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

