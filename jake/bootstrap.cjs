const fs = require("fs");
const path = require("path");
const jakelibDir = path.join(process.cwd(), "jakelib");

// Load the main tasks file.
require(path.join(process.cwd(), "jakefile.cjs"));

// Load the task files.
const files = fs.readdirSync(jakelibDir).filter(file => file.endsWith(".cjs"));
files.forEach(file => {
  const filePath = path.join(jakelibDir, file);
  require(filePath);
});

// If the default task is not defined, then define it to list the tasks.
const { Task } = require("jake");
if (!Task["default"]) {
  const {desc, task} = require("jake");
  desc("Display the tasks with descriptions");
  task("default", function () {
    const originalConsoleLog = console.log;
    console.log = (...args) => {
        originalConsoleLog((args.join(" ")).replace(/^jake\s+/, ""));
    };
    const { run } = require("jake");
    run.apply(global.jake, ["--tasks"]);
  });  
}

desc("Display the tasks");
task("tasks", () => {
  const originalConsoleLog = console.log;
  console.log = function(...args) {
      originalConsoleLog((args.join(" ")).replace(/^jake[[ \t]*/, "").replace(/#/, " "));
  };
  const { run } = require("jake");
  run.apply(global.jake, ["--tasks"]);
});
