const cluster = require("cluster")
const http = require("http")
const {resolve} = require('path')
const cpus = require("os").cpus()

if(cluster.isPrimary) {
    cpus.forEach(() => {
        cluster.fork()
    })
} else {
    http.createServer((req,res) => {
        res.end('child_process' + '\n' + process.pid + '\n')
    }).listen(3000)
}

//  进程守护
cluster.on('exit', (worker, code, signal) => {
    console.log(
        `worker ${wroker.process.pid} died, code: ${code}, signal: ${signal}`
    )
    cluster.fork()
})