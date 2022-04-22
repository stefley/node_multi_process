const fs = require("fs")

setInterval(() => {
    fs.appendFileSync("test_detached.txt", "detached\n")
}, 1000)