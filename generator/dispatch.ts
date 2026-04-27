import { execSync } from "child_process";
import { readFileSync, mkdirSync, cpSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "../shared/config.js";
import { logger } from "../shared/logger.js";
import { postProcess } from "./post-process.js";
import type { DispatchRequest } from "../bot/interaction.js";
import type { Platform } from "../filter/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatesDir = resolve(__dirname, "templates");
const scaffoldDir = resolve(__dirname, "..", "scaffold");

function loadTemplate(platform: Platform): string {
  const templatePath = resolve(templatesDir, `${platform}.md`);
  return readFileSync(templatePath, "utf-8");
}

function buildPrompt(req: DispatchRequest): string {
  const template = loadTemplate(req.platform);
  return template
    .replace("{{title}}", req.paperTitle)
    .replace("{{abstract}}", req.paperAbstract)
    .replace("{{categories}}", req.paperCategories.join(", "))
    .replace("{{paper_url}}", req.paperUrl);
}

function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9.-]/g, "_").slice(-20);
}

function copyScaffold(platform: Platform, outputDir: string): boolean {
  const src = resolve(scaffoldDir, platform);
  if (!existsSync(src)) return false;

  cpSync(src, outputDir, { recursive: true });
  logger.info(`Scaffold copied: ${platform} → ${outputDir}`);
  return true;
}

export async function dispatchAppGeneration(
  req: DispatchRequest
): Promise<void> {
  const appId = `${sanitizeId(req.paperId)}-${req.platform}`;
  const outputDir = resolve(
    config.APPS_OUTPUT_DIR.replace("~", process.env.HOME ?? "~"),
    appId
  );
  mkdirSync(outputDir, { recursive: true });

  const hasScaffold = copyScaffold(req.platform, outputDir);

  if (hasScaffold) {
    execSync("npm install", { cwd: outputDir, stdio: "inherit", timeout: 120_000 });
  }

  const prompt = buildPrompt(req);
  logger.info(`Generating ${req.platform} app for: ${req.paperTitle}`);
  logger.info(`Output dir: ${outputDir}`);

  try {
    execSync(
      `claude -p ${JSON.stringify(prompt)} --dangerously-skip-permissions`,
      {
        cwd: outputDir,
        stdio: "inherit",
        timeout: 10 * 60 * 1000,
        env: { ...process.env, ANTHROPIC_API_KEY: config.ANTHROPIC_API_KEY },
      }
    );

    logger.info(`App generated: ${outputDir}`);

    await postProcess({
      appId,
      outputDir,
      platform: req.platform,
      paper: {
        title: req.paperTitle,
        url: req.paperUrl,
      },
    });
  } catch (err) {
    logger.error(`Generation failed for ${appId}: ${err}`);
    throw err;
  }
}
