const {
  miniProgram: { envVersion },
} = wx.getAccountInfoSync();

function getDomain() {
  return envVersion === "develop"
    ? "https://www.lvpangpang.com/api"
    : "https://www.lvpangpang.com/api";
}
function request(props) {
  const { method, url, data } = props;
  const domain = getDomain();
  return new Promise((resolve, reject) => {
    wx.request({
      method: method || "GET",
      url: domain + url,
      timeout: 10000,
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
          wx.removeStorageSync("token");
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
          title: err.errMsg || "服务端错误",
        });
      },
    });
  });
}
module.exports = {
  request,
  getDomain,
};
