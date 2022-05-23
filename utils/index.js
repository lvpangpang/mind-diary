const {
  miniProgram: { envVersion },
} = wx.getAccountInfoSync();

function request(props) {
  const { method, url, data } = props;
  const domain =
    envVersion === "develop"
      ? "http://127.0.0.1:7001"
      : "https://www.lvpangpang.com";
  return new Promise((resolve, reject) => {
    wx.request({
      method: method || "GET",
      url: domain + url,
      header: {
        token: wx.getStorageSync("token"),
      },
      data,
      success: (result) => {
        const { code, data, msg } = result.data;
        if (code === 200) {
          resolve(data);
          return;
        } else if (code === 401) {
          wx.showToast({
            icon: "error",
            title: "未登录",
          });
        }
        wx.showToast({
          icon: "error",
          title: msg,
        });
        reject(result.data);
      },
      fail: (err) => {
        reject(err);
        wx.showToast({
          icon: "error",
          title: "服务端错误",
        });
      },
    });
  });
}
module.exports = {
  request,
};
