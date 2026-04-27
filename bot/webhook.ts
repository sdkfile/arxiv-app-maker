import { readFileSync } from "fs";
import { config } from "../shared/config.js";
import { logger } from "../shared/logger.js";
import { buildPaperEmbed } from "./embeds.js";
import type { ScoredPaper } from "../filter/types.js";

async function sendWebhook(payload: object): Promise<void> {
  const res = await fetch(config.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Webhook failed: ${res.status} ${await res.text()}`);
  }
}

export async function notifyPapers(papers: ScoredPaper[]): Promise<void> {
  logger.info(`Sending ${papers.length} papers to Discord...`);

  for (const sp of papers) {
    const embed = buildPaperEmbed(sp);
    await sendWebhook(embed);
    await new Promise((r) => setTimeout(r, 1000));
  }

  logger.info("All notifications sent");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dataPath = process.argv[2] ?? "data/scored.json";
  const scored: ScoredPaper[] = JSON.parse(readFileSync(dataPath, "utf-8"));
  await notifyPapers(scored);
}
