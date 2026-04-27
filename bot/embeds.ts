import type { ScoredPaper, Platform } from "../filter/types.js";
import { PLATFORM_LABELS } from "../filter/types.js";

function scoreStars(score: number): string {
  return "★".repeat(score) + "☆".repeat(10 - score);
}

export function buildPaperEmbed(sp: ScoredPaper) {
  const { paper, evaluation } = sp;
  const authors =
    paper.authors.length > 3
      ? `${paper.authors.slice(0, 2).join(", ")} et al.`
      : paper.authors.join(", ");

  return {
    embeds: [
      {
        title: `📄 ${paper.title}`,
        url: paper.html_url,
        color: evaluation.score >= 8 ? 0x00ff88 : 0xffaa00,
        fields: [
          {
            name: "📊 앱 적합성",
            value: `${scoreStars(evaluation.score)} (${evaluation.score}/10)`,
            inline: false,
          },
          {
            name: "📁 카테고리",
            value: paper.categories.join(", "),
            inline: true,
          },
          {
            name: "👥 저자",
            value: authors,
            inline: true,
          },
          {
            name: "🔧 난이도",
            value: evaluation.difficulty,
            inline: true,
          },
          {
            name: "💡 앱 아이디어",
            value: evaluation.app_idea,
            inline: false,
          },
          {
            name: "🛠️ 핵심 기능",
            value: evaluation.core_features.map((f) => `• ${f}`).join("\n"),
            inline: false,
          },
        ],
        footer: {
          text: `${evaluation.recommended_type} | ${paper.id}`,
        },
        timestamp: paper.published,
      },
    ],
  };
}

export function buildCompletionEmbed(
  paper: { title: string; html_url: string },
  platform: Platform,
  repoUrl: string,
  deployUrl?: string
) {
  return {
    embeds: [
      {
        title: "✅ 앱 생성 완료",
        color: 0x00ff88,
        fields: [
          { name: "📄 논문", value: `[${paper.title}](${paper.html_url})`, inline: false },
          { name: "🔧 플랫폼", value: PLATFORM_LABELS[platform], inline: true },
          { name: "📦 GitHub", value: `[Repo](${repoUrl})`, inline: true },
          ...(deployUrl
            ? [{ name: "🚀 배포", value: `[Live](${deployUrl})`, inline: true }]
            : []),
        ],
      },
    ],
  };
}
