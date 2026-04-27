import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { config } from "../shared/config.js";
import { logger } from "../shared/logger.js";
import { buildScoringPrompt } from "./criteria.js";
import type { AppEvaluation, Paper, ScoredPaper } from "./types.js";

const client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

export async function scorePaper(paper: Paper): Promise<ScoredPaper | null> {
  const abstract = paper.abstract ?? "";
  if (!abstract) {
    logger.warn(`No abstract for ${paper.id}, skipping`);
    return null;
  }

  const prompt = buildScoringPrompt(paper.title, abstract);

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    logger.error(`Failed to parse evaluation for: ${paper.title}`);
    return null;
  }

  const evaluation: AppEvaluation = JSON.parse(jsonMatch[0]);
  return { paper, evaluation };
}

export async function scoreAll(papers: Paper[]): Promise<ScoredPaper[]> {
  const results: ScoredPaper[] = [];

  for (const paper of papers) {
    try {
      const scored = await scorePaper(paper);
      if (scored && scored.evaluation.score >= config.SCORE_THRESHOLD) {
        results.push(scored);
        logger.info(
          `[${scored.evaluation.score}/10] ${paper.title} → ${scored.evaluation.app_idea}`
        );
      }
    } catch (err) {
      logger.error(`Error scoring ${paper.id}: ${err}`);
    }
  }

  logger.info(`Filtered ${results.length}/${papers.length} papers`);
  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dataPath = process.argv[2] ?? "data/metadata.jsonl";
  const lines = readFileSync(dataPath, "utf-8").trim().split("\n");
  const papers: Paper[] = lines.map((l) => JSON.parse(l));

  logger.info(`Scoring ${papers.length} papers...`);
  const scored = await scoreAll(papers);

  const outPath = "data/scored.json";
  const { writeFileSync, mkdirSync } = await import("fs");
  mkdirSync("data", { recursive: true });
  writeFileSync(outPath, JSON.stringify(scored, null, 2));
  logger.info(`Saved ${scored.length} scored papers to ${outPath}`);
}
