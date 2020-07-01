import * as core from "@actions/core";
import * as octokit from "@octokit/rest";
import consoleLogLevel from "console-log-level";

export const client = new octokit.Octokit({
  auth: core.getInput("token"),
  baseUrl: 'https://codescanning-status-reports.review-lab.github.com/api/v3',
  userAgent: "CodeQL Action",
  log: consoleLogLevel({ level: "debug" })
});
