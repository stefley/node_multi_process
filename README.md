## <center>nodejs 多进程</center>

### 为什么要多进程
```js
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
```
上面这个node服务，当我们访问`http://localhost:3000/fib`，因为斐波那契计算非常耗时，此时我们再开一个网页访问此服务下其他地址会因为服务正在计算`/fib`请求而卡住不能正常响应。
这种场景下可以采取开启nodejs多进程，这样费时请求不会阻塞其他请求的正常响应

<hr>

### spawn



 