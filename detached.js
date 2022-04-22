const { spawn, fork } = require("child_process");

const cp = spawn("node", ["writeFile.js"], {
  cwd: ".",
  stdio: 'ignore',
  detached: true
});

cp.unref()