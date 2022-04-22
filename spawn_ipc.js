const { spawn } = require("child_process");
const path = require("path")

const cp = spawn("node", ["spawn_example.js"], {
    pwd: ".",
    stdio: [0, 1, 2, "ipc"]
})

cp.send("父进程发送的数据")
cp.on("message", (data) => {
    console.log("父进程监听：", data)
})