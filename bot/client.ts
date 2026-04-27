import {
  Client,
  GatewayIntentBits,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  ButtonStyle,
  TextChannel,
  MessageFlags,
  type Interaction,
} from "discord.js";
import { config } from "../shared/config.js";
import { logger } from "../shared/logger.js";
import { PLATFORM_LABELS, type Platform } from "../filter/types.js";
import { dispatchAppGeneration, type StatusCallback } from "../generator/dispatch.js";
import type { ScoredPaper } from "../filter/types.js";
import { buildPaperEmbed } from "./embeds.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const paperCache = new Map<string, {
  title: string;
  abstract: string;
  categories: string[];
  url: string;
}>();

client.once(Events.ClientReady, (c) => {
  logger.info(`Bot logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  try {
    if (interaction.isButton()) {
      const customId = interaction.customId;
      if (!customId.startsWith("create_app:")) return;

      const paperId = customId.replace("create_app:", "");

      const select = new StringSelectMenuBuilder()
        .setCustomId(`select_platform:${paperId}`)
        .setPlaceholder("플랫폼을 선택하세요")
        .addOptions(
          Object.entries(PLATFORM_LABELS).map(([value, label]) => ({
            label,
            value,
            emoji: ({
              nextjs: "🌐",
              ios: "📱",
              watchos: "⌚",
              macos: "🖥️",
              "react-native": "📱",
              cli: "🤖",
              "chrome-ext": "⚡",
            } as Record<string, string>)[value],
          }))
        );

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);

      await interaction.reply({
        content: "플랫폼을 선택하세요:",
        components: [row],
        flags: [MessageFlags.Ephemeral],
      });
    }

    if (interaction.isStringSelectMenu()) {
      const customId = interaction.customId;
      if (!customId.startsWith("select_platform:")) return;

      const paperId = customId.replace("select_platform:", "");
      const platform = interaction.values[0] as Platform;
      const cached = paperCache.get(paperId);

      const paperTitle = cached?.title ?? paperId;
      const paperAbstract = cached?.abstract ?? "";
      const paperCategories = cached?.categories ?? [];
      const paperUrl = cached?.url ?? "";

      await interaction.reply({
        content: `⏳ **${paperTitle}** → ${PLATFORM_LABELS[platform]} 앱 생성을 시작합니다...`,
        flags: [MessageFlags.Ephemeral],
      });

      const channel = interaction.channel;
      if (!channel || !("send" in channel)) return;

      const progressMsg = await (channel as TextChannel).send({
        embeds: [{
          title: `🔧 앱 생성 중: ${paperTitle}`,
          description: `플랫폼: **${PLATFORM_LABELS[platform]}**\n\n⏳ 초기화 중...`,
          color: 0xffaa00,
          timestamp: new Date().toISOString(),
        }],
      });

      const stages = ["scaffold", "install", "generate", "post", "done"];
      const stageEmojis: Record<string, string> = {
        scaffold: "📦", install: "📥", generate: "🤖", post: "🚀", done: "✅", error: "❌",
      };

      const completedStages: string[] = [];

      const onStatus: StatusCallback = async (stage, detail) => {
        completedStages.push(stage);

        const progress = stages.map((s) => {
          if (completedStages.includes(s)) return `${stageEmojis[s]} ~~${s}~~ ✓`;
          if (s === stage) return `▶ ${stageEmojis[s]} **${s}**`;
          return `⬜ ${s}`;
        }).join("\n");

        const color = stage === "done" ? 0x00ff88 : stage === "error" ? 0xff4444 : 0xffaa00;

        await progressMsg.edit({
          embeds: [{
            title: stage === "done"
              ? `✅ 완료: ${paperTitle}`
              : stage === "error"
                ? `❌ 실패: ${paperTitle}`
                : `🔧 생성 중: ${paperTitle}`,
            description: `플랫폼: **${PLATFORM_LABELS[platform]}**\n\n${progress}\n\n${detail}`,
            color,
            timestamp: new Date().toISOString(),
          }],
        }).catch((err: Error) => logger.error(`Progress update failed: ${err}`));
      };

      dispatchAppGeneration(
        { paperId, paperTitle, paperAbstract, paperCategories, paperUrl, platform },
        onStatus
      ).catch((err) => logger.error(`Dispatch failed: ${err}`));
    }
  } catch (err) {
    logger.error(`Interaction error: ${err}`);
  }
});

export async function startBot(): Promise<void> {
  if (!config.DISCORD_BOT_TOKEN) {
    throw new Error("DISCORD_BOT_TOKEN required");
  }
  await client.login(config.DISCORD_BOT_TOKEN);
}

export async function sendPapersToChannel(papers: ScoredPaper[]): Promise<void> {
  if (!config.DISCORD_CHANNEL_ID) {
    throw new Error("DISCORD_CHANNEL_ID required");
  }

  const channel = await client.channels.fetch(config.DISCORD_CHANNEL_ID);
  if (!channel || !(channel instanceof TextChannel)) {
    throw new Error(`Channel ${config.DISCORD_CHANNEL_ID} not found or not text channel`);
  }

  for (const sp of papers) {
    const embedData = buildPaperEmbed(sp);
    const arxivId = sp.paper.id.split("/").pop() ?? sp.paper.id;

    paperCache.set(arxivId, {
      title: sp.paper.title,
      abstract: sp.paper.abstract ?? "",
      categories: sp.paper.categories,
      url: sp.paper.html_url,
    });

    const button = new ButtonBuilder()
      .setCustomId(`create_app:${arxivId}`)
      .setLabel("🚀 앱 만들기")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    await channel.send({
      embeds: embedData.embeds,
      components: [row],
    });

    await new Promise((r) => setTimeout(r, 1000));
  }

  logger.info(`Sent ${papers.length} papers with buttons to channel`);
}

export { client };
