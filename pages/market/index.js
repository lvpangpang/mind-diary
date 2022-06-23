const app = getApp();
const io = require("../../lib/weapp.socket.io.js");

Page({
  data: {
    list: [],
    total: 0,
  },

  onShow() {
    this.getData();
  },

  async getData() {
    const socket = io("http://127.0.0.1:3000/io", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      const id = socket.id;
      console.log("连接成功", id);
    });

    socket.emit("msg", "Jack");

    socket.on("msg", (d) => {
      const { username, message } = d;
      console.log("received: ", username, message);
    });
  },
});
