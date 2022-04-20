const http = require('http')
const { fib } = require('./fib')

http.createServer((req,res) => {
    console.log(req.url)
    if(req.url === '/fib') {
        res.end(fib(44).toString())
    } else {
        res.end('other')
    }
})
.listen(3000)