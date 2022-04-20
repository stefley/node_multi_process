function fibonacci(n)  {
    if (n < 0) throw new Error('输入数字不能小于0')
    if (n === 1 || n === 2) {
        return 1
    } else {
        return fibonacci(n -1) + fibonacci(n - 2)
    }
}

exports.fib = fibonacci 