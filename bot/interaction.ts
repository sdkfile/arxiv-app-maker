import {
  InteractionType,
  ComponentType,
  ButtonStyle,
} from "discord.js";
import type { Platform } from "../filter/types.js";
import { PLATFORM_LABELS } from "../filter/types.js";

export interface DispatchRequest {
  paperId: string;
  paperTitle: string;
  paperAbstract: string;
  paperCategories: string[];
  paperUrl: string;
  platform: Platform;
}

const platformOptions = (Object.entries(PLATFORM_LABELS) as [Platform, string][]).map(
  ([value, label]) => ({
    label,
    value,
    emoji: {
      nextjs: "🌐",
      ios: "📱",
      watchos: "⌚",
      macos: "🖥️",
      "react-native": "📱",
      cli: "🤖",
      "chrome-ext": "⚡",
    }[value],
  })
);

export function buildActionRow(paperId: string) {
  return {
    type: ComponentType.ActionRow,
    components: [
      {
        type: ComponentType.Button,
        style: ButtonStyle.Primary,
        label: "🚀 앱 만들기",
        custom_id: `create_app:${paperId}`,
      },
    ],
  };
}

export function buildSelectMenu(paperId: string) {
  return {
    type: ComponentType.ActionRow,
    components: [
      {
        type: ComponentType.StringSelect,
        custom_id: `select_platform:${paperId}`,
        placeholder: "플랫폼을 선택하세요",
        options: platformOptions,
      },
    ],
  };
}

export function parseInteraction(body: any): {
  type: "button" | "select";
  paperId: string;
  platform?: Platform;
} | null {
  if (body.type === InteractionType.MessageComponent) {
    const customId: string = body.data.custom_id;

    if (customId.startsWith("create_app:")) {
      return { type: "button", paperId: customId.replace("create_app:", "") };
    }

    if (customId.startsWith("select_platform:")) {
      const paperId = customId.replace("select_platform:", "");
      const platform = body.data.values?.[0] as Platform;
      return { type: "select", paperId, platform };
    }
  }
  return null;
}
