
process.on("message", data => {
    console.log("子进程接收信息：" + data.toString())
})

process.send("子进程发送信息1123")