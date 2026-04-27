import { runCollector } from "./collector/schedule.js";
import { enrichPapers } from "./collector/enrich.js";
import { scoreAll } from "./filter/score.js";
import { logger } from "./shared/logger.js";
import { readFileSync } from "fs";
import type { Paper } from "./filter/types.js";

const MAX_NOTIFY = 5;
const SERVER_URL = `http://localhost:${process.env.PORT ?? 7284}`;

async function main() {
  logger.info("=== arxiv-app pipeline start ===");

  logger.info("[1/4] Collecting papers...");
  runCollector();

  logger.info("[2/4] Fetching abstracts...");
  const lines = readFileSync("data/metadata.jsonl", "utf-8").trim().split("\n");
  const papers: Paper[] = lines.map((l) => JSON.parse(l));
  const enriched = await enrichPapers(papers);

  logger.info("[3/4] Scoring papers with LLM...");
  const scored = await scoreAll(enriched);

  if (scored.length === 0) {
    logger.info("No papers passed threshold. Done.");
    return;
  }

  const top = scored
    .sort((a, b) => b.evaluation.score - a.evaluation.score)
    .slice(0, MAX_NOTIFY);

  logger.info(`[4/4] Sending top ${top.length} papers to Discord via bot...`);
  const res = await fetch(`${SERVER_URL}/notify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(top),
  });

  if (!res.ok) {
    throw new Error(`Notify failed: ${res.status} ${await res.text()}`);
  }

  const result = await res.json() as { sent: number };
  logger.info(`Sent ${result.sent} papers`);
  logger.info("=== pipeline complete ===");
}

main().catch((err) => {
  logger.error(`Pipeline failed: ${err}`);
  process.exit(1);
});
