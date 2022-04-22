const http = require("http");

process.on("message", (data, server) => {
  if (data === "server") {
    http
      .createServer((req, res) => {
          res.hasHeader = "charset=utf-8"
        res.end(`子进程id:${process.pid}\n`);
      })
      .listen(server);
  }
});
