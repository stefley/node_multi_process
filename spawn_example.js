function fib(n) {
    if (n <= 1) {
        return 1
    }
    return fib(n-1) + fib(n-2)
}

// console.log('spawn>>>>>:'+fib(40))

// process.stdout.write('子进程输出： ' + fib(40))
// process.stdout.on("data", (data) => {
//     console.log("子进程接收：" + data.toString())
// })

process.on("message", (data) => {
    console.log("子进程接收信息：" + data.toString())
})
process.send("子进程发送信息....")