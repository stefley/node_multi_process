const http = require("http")

setInterval(() => {
    http.get({
        hostname: 'localhost',
        port: 3000
    }, (res) => {
        res.on('data', (chunk) => {
            console.log(chunk.toString())
        })
    })
})