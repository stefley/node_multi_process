const { spawn } = require('child_process')
const path = require('path') 

const cp = spawn("node", ['spawn_example.js'], {
    cwd: path.resolve(__dirname, "."),
    stdio: ["pipe", "pipe", "pipe"]
})

cp.stdout.on("data", (data) => {
    console.log("父进程监听子进程输出: "+data.toString())
})

cp.stdout.write("父进程输出信息...")

cp.on('error', (err) => {
    console.log("err info: " + err)
})