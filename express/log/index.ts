import express from "express";
import { spawn } from "child_process";
import { existsSync, unlinkSync, appendFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import joinPath from "#helpers/get_path.js";

global.npmProcess = null;

export const logRequest = express.Router();
const path = joinPath("../../", import.meta.url);
logRequest.route("/").post((req, res) => {
  if (!req.body || req.body.confirm !== "true") {
    res.status(400).send("You did not confirm the update.");
    return;
  }

  // Skip rerun process
  if (global.npmProcess) {
    res.redirect("/log");
    return;
  }

  const npmProcess = spawn("npm", ["run", "parse"], { detached: true });
  global.npmProcess = npmProcess;

  const file = join(path, "parselog.txt");
  if (existsSync(file)) {
    unlinkSync(file);
  }

  // Capture standard output (stdout) logs
  npmProcess.stdout.on("data", data => {
    appendFileSync(file, `STDOUT log: ${data}\n`);
    console.log(`STDOUT log: ${data}`);
  });

  // Capture standard error (stderr) logs
  npmProcess.stderr.on("data", data => {
    appendFileSync(file, `STDERR log: ${data}\n`);
    console.error(`STDERR log: ${data}`);
  });

  // Handle the process closing
  npmProcess.on("close", code => {
    appendFileSync(file, `Child process closed with code ${code}\n`);
    console.log(`STDOUT log: ${code}`);
    global.npmProcess = null;
  });

  // Handle any errors during the process execution
  npmProcess.on("error", err => {
    const message = `Failed to start child process: ${err.message}\n`;
    appendFileSync(file, message);
    global.npmProcess = null;
  });

  res.redirect("/log");
});

logRequest.route("/stop").get((req, res) => {
  const file = join(path, "parselog.txt");

  if (global.npmProcess && global.npmProcess.pid) {
    appendFileSync(file, "Parsing process was manually stopped by the user.\n");
    try {
      process.kill(-global.npmProcess.pid);
    } catch (e) {
      console.error("Failed to kill process:", e);
      appendFileSync(file, `Failed to kill process: ${e}\n`);
    }
    global.npmProcess = null;
  }

  res.redirect("/log");
});

logRequest.route("/").get((req, res) => {
  const file = join(path, "parselog.txt");
  let log = "No logs available.";
  if (existsSync(file)) {
    log = readFileSync(file, "utf-8");
  }

  res.render("log.html", { log, stopped: !global.npmProcess });
});

export default logRequest;
