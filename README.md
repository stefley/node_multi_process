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
        res.end('hellonodejs')
    }
})
.listen(3000)
```
上面这个node服务，当我们访问`http://localhost:3000/fib`，因为斐波那契计算非常耗时，此时我们再开一个网页访问此服务下其他地址会因为服务正在计算`/fib`请求而卡住不能正常响应。
这种场景下可以采取开启nodejs多进程，这样费时请求不会阻塞其他请求的正常响应

<hr>

### child_process 子进程


#### spawn
`child_process.spawn(command[, args][, options])`

`child_process.spawn()` 方法异步衍生子进程，不会阻塞 Node.js 事件循环。 `child_process.spawnSync()` 函数以同步方式提供等效的功能，其会阻塞事件循环，直到衍生的进程退出或终止
```js
const { spawn } = require("child_process");
const path = require("path");

const cp = spawn("node", ["spawn_example.js"], {
  cwd: path.resolve(__dirname, "./"),
  stdio: [0, 1, 2] // [process.stdin, process.stdout, process.stderr]
});

cp.on("error", (err) => {
  console.log(err);
});

cp.on("exit", (code, signal) => {
  console.log("exit", code, signal); // exit 1 null
});

cp.on("close", (code, signal) => {
  console.log("close", code, signal); // close 1 null
});
``` 

流方式进程通信
```js
const { spawn } = require('child_process')
const path = require('path') 

const cp = spawn("node", ['spawn_example.js'], {
    cwd: path.resolve(__dirname, "./"),
    stdio: ["pipe", "pipe", "pipe"]
})

cp.stdout.on("data", (data) => {
    console.log("父进程监听子进程输出: "+data.toString())
})
cp.stdout.write("父进程输出信息...")
```
ipc方式通信
```js
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
``` 
#### fork
`child_process.fork(modulePath[, args][, options])`
`child_process.fork()` 方法是` child_process.spawn()` 的特例，专门用于衍生新的 Node.js 进程。 与 `child_process.spawn()` 一样，返回 `ChildProcess` 对象。 返回的` ChildProcess` 将有额外的内置通信通道，允许消息在父进程和子进程之间来回传递
```js
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
```
#### execFile
`child_process.execFile(file[, args][, options][, callback])`
`child_process.execFile()` 函数与 `child_process.exec()` 类似，不同之处在于它默认不衍生 `shell`。 而是，指定的可执行文件 `file` 直接作为新进程衍生，使其比 `child_process.exec()` 略有效率。
支持与` child_process.exec()` 相同的选项。 由于未衍生 `shell`，因此不支持 `I/O` 重定向和文件通配等行为
```js
const { execFile } = require("child_process");

const cp = execFile(
  "node",
  ["execFileWorker.js"],
  {
    cwd: ".",
  },
  (err, stdout, stderr) => {
      console.log(stdout)
  }
);

cp.on("error", err => {
    console.log(err)
})
```

执行脚本
```js
const cp = execFile(
  "node",
  ["--version"],
  {
    cwd: ".",
  },
  (err, stdout, stderr) => {
      console.log("err: " + err)
      console.log("stdout: " + stdout)
      console.log("stderr " + stderr)
  }
);
```
#### exec
`child_process.exec(command[, options][, callback])`
衍生 `shell`，然后在该 `shell` 中执行 `command`，缓冲任何生成的输出。 传给执行函数的 `command` 字符串由` shell` 直接处理，特殊字符（因 `shell` 而异）需要进行相应处理：
```js
const { exec } = require('child_process');

exec('"/path/to/test file/test.sh" arg1 arg2');
// 使用双引号，这样路径中的空格就不会被解释为多个参数的分隔符。

exec('echo "The \\$HOME variable is $HOME"');
// $HOME 变量在第一个实例中被转义，但在第二个实例中没有。
```
```js
const { exec } = require('child_process');
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```
### 独立子进程
父进程关闭子进程也会关闭，可以通过开启独立子进程使子进程不受父进程控制
```js
const { spawn, fork } = require("child_process");

const cp = spawn("node", ["writeFile.js"], {
  cwd: ".",
  stdio: 'ignore',
  detached: true
});

cp.unref()
```

### cluster集群
`Node.js` 进程集群可用于运行多个 `Node.js` 实例，这些实例可以在其应用程序线程之间分配工作负载。 当不需要进程隔离时，请改用 `worker_threads` 模块，它允许在单个 `Node.js` 实例中运行多个应用程序线程。

集群模块可以轻松创建共享服务器端口的子进程。 
```js
import cluster from 'cluster';
import http from 'http';
import { cpus } from 'os';
import process from 'process';

const numCPUs = cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // 衍生工作进程。
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // 工作进程可以共享任何 TCP 连接
  // 在本示例中，其是 HTTP 服务器
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```
```js
import cluster from 'cluster';

cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'https'],
  silent: true
});
cluster.fork(); // https 工作进程
cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'http']
});
cluster.fork(); // http 工作进程
```
运行 Node.js 现在将在工作进程之间共享端口 8000：

工作进程使用 `child_process.fork()` 方法衍生，因此它们可以通过 `IPC` 与父进程通信并且来回传递服务器句柄。
集群模块支持两种分发传入连接的方法。

第一个（以及除 `Windows` 之外的所有平台上的默认方法）是循环方法，其中主进程监听端口，接受新连接并以循环方式将它们分发给工作进程，其中一些内置智能以避免工作进程超载。

第二种方法是，主进程创建监听套接字并将其发送给感兴趣的工作进程。 然后工作进程直接接受传入的连接。

理论上，第二种方法具有最好的性能。 但是，在实践中，由于操作系统调度机制难以捉摸，分发往往非常不平衡。 可能会出现八个进程中的两个进程分担了所有连接超过 70% 的负载。

由于 `server.listen()` 将大部分工作交给了主进程，因此普通的 `Node.js` 进程和集群工作进程之间的行为在三种情况下会有所不同：

`server.listen({fd: 7})` 因为消息传给主进程，所以父进程中的文件描述符 7 将被监听，并将句柄传给工作进程，而不是监听文件描述符 7 引用的工作进程。
`server.listen(handle)` 显式地监听句柄，将使工作进程使用提供的句柄，而不是与主进程对话。
`server.listen(0)` 通常，这会使服务器监听随机端口。 但是，在集群中，每个工作进程每次执行 `listen(0)` 时都会接收到相同的"随机"端口。 实质上，端口第一次是随机的，但之后是可预测的。 要监听唯一的端口，则根据集群工作进程 `ID` 生成端口号。
`Node.js` 不提供路由逻辑。 因此，重要的是设计一个应用程序，使其不会过于依赖内存中的数据对象来处理会话和登录等事情。

因为工作进程都是独立的进程，所以它们可以根据程序的需要被杀死或重新衍生，而不会影响其他工作进程。 只要还有工作进程仍然活动，服务器就会继续接受连接。 如果没有工作进程活动，则现有的连接将被丢弃，且新的连接将被拒绝。 但是，`Node.js` 不会自动管理工作进程的数量。 应用程序有责任根据自己的需要管理工作进程池。

尽管 `cluster` 模块的主要使用场景是网络，但它也可用于需要工作进程的其他使用场景。


## <center>nodejs 多线程</center>
Node.js 通过提供 cluster、child_process API 创建子进程的方式来赋予Node.js “多线程”能力。但是这种创建进程的方式会牺牲共享内存，并且数据通信必须通过json进行传输。（有一定的局限性和性能问题）

基于此 Node.js V10.5.0 提供了 worker_threads，它比 child_process 或 cluster更轻量级。 与child_process 或 cluster 不同，worker_threads 可以共享内存，通过传输 ArrayBuffer 实例或共享 SharedArrayBuffer 实例来实现

Node.js 并没有其它支持多线的程语言（如：java），诸如"synchronized"之类的关键字来实现线程同步的概念。Node.js的 worker_threads 区别于它们的多线程。如果添加线程，语言本身的性质将发生变化，所以不能将线程作为一组新的可用类或函数添加。

我们可以将其理解为：JavaScript和Node.js永远不会有线程，只有基于Node.js 架构的多工作线程

浏览器端： HTML5 制定了 Web Worker 标准（Web Worker 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行）。

Node端：采用了和 Web Worker相同的思路来解决单线程中大量计算问题 ，官方提供了 child_process 模块和 cluster 模块， cluster 底层是基于child_process实现。

child_process、cluster都是用于创建子进程，然后子进程间通过事件消息来传递结果，这个可以很好地保持应用模型的简单和低依赖。从而解决无法利用多核 CPU 和程序健壮性问题。

Node V10.5.0： 提供了实验性质的 worker_threads模块，才让Node拥有了多工作线程。

Node V12.0.0：worker_threads 已经成为正式标准，可以在生产环境放心使用。

也有很多开发者认为 worker_threads 违背了nodejs设计的初衷，事实上那是它并没有真正理解 worker_threads 的底层原理。其次是每一种语言的出现都有它的历史背景和需要解决的问题，在技术发展的过程中各种语言都是在取长补短，worker_threads 的设计就是技术发展的需要

```js
const {
  Worker, isMainThread, parentPort, workerData
} = require('worker_threads');

if (isMainThread) {
  module.exports = function parseJSAsync(script) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: script
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  };
} else {
  const { parse } = require('some-js-parsing-library');
  const script = workerData;
  parentPort.postMessage(parse(script));
}
```
在构造 worker的时候 传入了一个名为workerData的对象，这是我们希望线程在开始运行时可以访问的数据。

workerData 可以是任何一个JavaScript 值