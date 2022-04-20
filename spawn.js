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
