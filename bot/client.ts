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
import { dispatchAppGeneration } from "../generator/dispatch.js";
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
        content: `⏳ **${paperTitle}** → ${PLATFORM_LABELS[platform]} 앱 생성 시작...`,
        flags: [MessageFlags.Ephemeral],
      });

      dispatchAppGeneration({
        paperId,
        paperTitle,
        paperAbstract,
        paperCategories,
        paperUrl,
        platform,
      }).catch((err) => logger.error(`Dispatch failed: ${err}`));
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
