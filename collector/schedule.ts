import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { logger } from "../shared/logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const collectScript = resolve(__dirname, "collect.sh");

export function runCollector(): void {
  logger.info("Starting paper collection...");
  try {
    execSync(`bash "${collectScript}"`, { stdio: "inherit" });
    logger.info("Collection complete");
  } catch (err) {
    logger.error(`Collection failed: ${err}`);
    throw err;
  }
}

export function scheduleCron(): void {
  const INTERVAL_MS = 24 * 60 * 60 * 1000;
  const now = new Date();
  const next9AM = new Date(now);
  next9AM.setHours(9, 0, 0, 0);
  if (next9AM <= now) next9AM.setDate(next9AM.getDate() + 1);

  const delay = next9AM.getTime() - now.getTime();
  logger.info(`Next collection at ${next9AM.toISOString()} (in ${Math.round(delay / 60000)}m)`);

  setTimeout(() => {
    runCollector();
    setInterval(runCollector, INTERVAL_MS);
  }, delay);
}
