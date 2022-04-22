// 多核cpu 一核一进程
const os = require("os");
const http = require("http");
const { fork } = require("child_process")
const path = require("path");
const cpus = os.cpus();

const server = http
  .createServer((req, res) => {
    res.sendDate("master" + "\n");
  })
  .listen(3000);

// 主进程占1核，生成cpus-1个子进程
for (let i = 0; i < cpus.length - 1; i++) {
  const cp = fork("server.js", {
    cwd: path.resolve(__dirname, "."),
  });
  // ipc 模式  第二个参数可以传入http服务或tcp服务
  cp.send('server', server)
}
