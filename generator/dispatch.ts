import { execSync } from "child_process";
import { readFileSync, mkdirSync, cpSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "../shared/config.js";
import { logger } from "../shared/logger.js";
import { postProcess, type PostProcessResult } from "./post-process.js";
import type { DispatchRequest } from "../bot/interaction.js";
import type { Platform } from "../filter/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatesDir = resolve(__dirname, "templates");
const scaffoldDir = resolve(__dirname, "..", "scaffold");

export type StatusCallback = (stage: string, detail: string) => Promise<void>;

function loadTemplate(platform: Platform): string {
  return readFileSync(resolve(templatesDir, `${platform}.md`), "utf-8");
}

function buildPrompt(req: DispatchRequest): string {
  return loadTemplate(req.platform)
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
  return true;
}

export async function dispatchAppGeneration(
  req: DispatchRequest,
  onStatus?: StatusCallback
): Promise<PostProcessResult | null> {
  const status = onStatus ?? (async () => {});
  const appId = `${sanitizeId(req.paperId)}-${req.platform}`;
  const outputDir = resolve(
    config.APPS_OUTPUT_DIR.replace("~", process.env.HOME ?? "~"),
    appId
  );
  mkdirSync(outputDir, { recursive: true });

  await status("scaffold", "📦 보일러플레이트 복사 중...");
  const hasScaffold = copyScaffold(req.platform, outputDir);

  if (hasScaffold) {
    await status("install", "📥 npm install 실행 중...");
    execSync("npm install", { cwd: outputDir, stdio: "inherit", timeout: 120_000 });
  }

  const prompt = buildPrompt(req);
  logger.info(`Generating ${req.platform} app for: ${req.paperTitle}`);

  await status("generate", `🤖 Claude Code 앱 생성 중...\n📂 \`${outputDir}\``);

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
    await status("post", "🚀 GitHub push + 배포 처리 중...");

    const result = await postProcess({
      appId,
      outputDir,
      platform: req.platform,
      paper: { title: req.paperTitle, url: req.paperUrl },
    });

    const links = [
      result.repoUrl ? `📦 [GitHub](${result.repoUrl})` : null,
      result.deployUrl ? `🌐 [Live](${result.deployUrl})` : null,
    ].filter(Boolean).join(" | ");

    await status("done", `✅ 앱 생성 완료!\n${links}`);
    return result;
  } catch (err) {
    await status("error", `❌ 생성 실패: ${err}`);
    logger.error(`Generation failed for ${appId}: ${err}`);
    throw err;
  }
}
