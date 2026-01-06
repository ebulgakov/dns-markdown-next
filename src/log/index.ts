import express from "express";
import { spawn } from "child_process";
import { existsSync, unlinkSync, appendFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import getPath from "#helpers/get_path.js";

export const logRequest = express.Router();

logRequest.route("/").post((req, res) => {
  if (!req.body || req.body.confirm !== "true") {
    res.status(400).send("You did not confirm the update.");
    return;
  }

  const npmProcess = spawn("npm", ["run", "parse"]);
  if (existsSync(join(getPath("../../", import.meta.url), "parselog.txt")))
    unlinkSync(join(getPath("../../", import.meta.url), "parselog.txt"));

  const file = join(getPath("../../", import.meta.url), "parselog.txt");

  // Capture standard output (stdout) logs
  npmProcess.stdout.on("data", data => {
    appendFileSync(file, `STDOUT log: ${data}\n`);
  });

  // Capture standard error (stderr) logs
  npmProcess.stderr.on("data", data => {
    appendFileSync(file, `STDERR log: ${data}\n`);
  });

  // Handle the process closing
  npmProcess.on("close", code => {
    appendFileSync(file, `Child process closed with code ${code}\n`);
  });

  // Handle any errors during the process execution
  npmProcess.on("error", err => {
    appendFileSync(file, `Failed to start child process: ${err.message}\n`);
  });
  res.redirect("/log");
});

logRequest.route("/").get((req, res) => {
  const file = join(getPath("../../", import.meta.url), "parselog.txt");
  let log = "No logs available.";
  if (existsSync(file)) {
    log = readFileSync(file, "utf-8");
  }

  res.render("log.html", { log });
});

export default logRequest;
