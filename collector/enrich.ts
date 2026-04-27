import { readFileSync, writeFileSync } from "fs";
import { logger } from "../shared/logger.js";
import type { Paper } from "../filter/types.js";

function extractId(fullId: string): string {
  return fullId.replace("http://arxiv.org/abs/", "").replace(/v\d+$/, "");
}

async function fetchAbstracts(
  papers: Paper[]
): Promise<Map<string, string>> {
  const ids = papers.map((p) => extractId(p.id));
  const batchSize = 20;
  const abstracts = new Map<string, string>();

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const url = `http://export.arxiv.org/api/query?id_list=${batch.join(",")}&max_results=${batch.length}`;

    logger.info(`Fetching abstracts ${i + 1}-${i + batch.length}...`);
    const res = await fetch(url);
    const xml = await res.text();

    const entries = xml.split("<entry>");
    for (const entry of entries.slice(1)) {
      const idMatch = entry.match(/<id>http:\/\/arxiv\.org\/abs\/([^<]+)<\/id>/);
      const summaryMatch = entry.match(/<summary>([\s\S]*?)<\/summary>/);
      if (idMatch && summaryMatch) {
        const cleanId = idMatch[1].replace(/v\d+$/, "");
        const abstract = summaryMatch[1].trim().replace(/\s+/g, " ");
        abstracts.set(cleanId, abstract);
      }
    }

    if (i + batchSize < ids.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  return abstracts;
}

export async function enrichPapers(papers: Paper[]): Promise<Paper[]> {
  const abstracts = await fetchAbstracts(papers);

  return papers.map((p) => {
    const id = extractId(p.id);
    return { ...p, abstract: abstracts.get(id) ?? "" };
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dataPath = process.argv[2] ?? "data/metadata.jsonl";
  const lines = readFileSync(dataPath, "utf-8").trim().split("\n");
  const papers: Paper[] = lines.map((l) => JSON.parse(l));

  logger.info(`Enriching ${papers.length} papers with abstracts...`);
  const enriched = await enrichPapers(papers);
  const withAbstract = enriched.filter((p) => p.abstract);
  logger.info(`Got abstracts for ${withAbstract.length}/${papers.length} papers`);

  writeFileSync(
    "data/enriched.jsonl",
    enriched.map((p) => JSON.stringify(p)).join("\n")
  );
}
