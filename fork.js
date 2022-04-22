const { fork } = require("child_process")
const path = require("path")

const cp = fork("fork_example.js", {
    cwd: path.resolve(__dirname, "fork_test/")
})

cp.on("error", err => {
    console.log(err)
})

cp.on("exit", (code, signal) => {
    console.log("exit: " + code, signal)
})

cp.on("close", (code, signal) => {
    console.log("close: " + code, signal)
})

// fork默认使用的ipc
cp.send("子进程发送信息...")
cp.on("message", data => {
    console.log("父进程接收信息：" + data.toString())
})