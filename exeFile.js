const { execFile } = require("child_process");
const path = require("path");

// const cp = execFile(
//   "node",
//   ["execFileWorker.js"],
//   {
//     cwd: ".",
//   },
//   (err, stdout, stderr) => {
//       console.log(stdout)
//   }
// );

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

cp.on("error", (err) => {
  console.log(err);
});
