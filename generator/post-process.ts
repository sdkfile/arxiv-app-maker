import { execSync } from "child_process";
import { config } from "../shared/config.js";
import { logger } from "../shared/logger.js";
import type { Platform } from "../filter/types.js";

interface PostProcessInput {
  appId: string;
  outputDir: string;
  platform: Platform;
  paper: { title: string; url: string };
}

export interface PostProcessResult {
  repoUrl: string;
  deployUrl?: string;
}

function run(cmd: string, cwd: string): string {
  return execSync(cmd, { cwd, encoding: "utf-8", timeout: 120_000 });
}

export async function postProcess(input: PostProcessInput): Promise<PostProcessResult> {
  const { appId, outputDir, platform, paper } = input;

  logger.info(`Post-processing: ${appId}`);

  try {
    run("git init", outputDir);
    run("git add -A", outputDir);
    run(`git commit -m "feat: ${paper.title} demo app"`, outputDir);
  } catch (err) {
    logger.error(`Git init failed: ${err}`);
  }

  let repoUrl = "";
  try {
    const repoName = `arxiv-${appId}`;
    run(`gh repo create ${repoName} --public --source=. --push`, outputDir);
    repoUrl = `https://github.com/${getGitHubUser()}/${repoName}`;
    logger.info(`Pushed to ${repoUrl}`);
  } catch (err) {
    logger.error(`GitHub push failed: ${err}`);
  }

  let deployUrl: string | undefined;
  if (platform === "nextjs" && config.VERCEL_TOKEN) {
    try {
      const result = run("vercel --prod --yes", outputDir);
      const urlMatch = result.match(/https:\/\/[^\s]+\.vercel\.app/);
      deployUrl = urlMatch?.[0];
      logger.info(`Deployed to ${deployUrl}`);
    } catch (err) {
      logger.error(`Vercel deploy failed: ${err}`);
    }
  }

  return { repoUrl, deployUrl };
}

function getGitHubUser(): string {
  try {
    return execSync("gh api user -q .login", { encoding: "utf-8" }).trim();
  } catch {
    return "unknown";
  }
}
