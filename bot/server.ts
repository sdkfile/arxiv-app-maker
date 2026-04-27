import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { startBot, sendPapersToChannel } from "./client.js";
import { logger } from "../shared/logger.js";
import type { ScoredPaper } from "../filter/types.js";

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));

app.post("/notify", async (c) => {
  const papers: ScoredPaper[] = await c.req.json();
  await sendPapersToChannel(papers);
  return c.json({ sent: papers.length });
});

const PORT = Number(process.env.PORT ?? 7284);

async function main() {
  await startBot();
  logger.info("Discord bot connected");

  serve({ fetch: app.fetch, port: PORT });
  logger.info(`Server running at http://localhost:${PORT}`);
}

main().catch((err) => {
  logger.error(`Server startup failed: ${err}`);
  process.exit(1);
});
