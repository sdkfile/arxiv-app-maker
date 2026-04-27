import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DISCORD_WEBHOOK_URL: z.string().url(),
  DISCORD_APP_ID: z.string().optional(),
  DISCORD_BOT_TOKEN: z.string().optional(),
  DISCORD_PUBLIC_KEY: z.string().optional(),
  DISCORD_CHANNEL_ID: z.string().optional(),
  ANTHROPIC_API_KEY: z.string(),
  GITHUB_TOKEN: z.string().optional(),
  VERCEL_TOKEN: z.string().optional(),
  ARXIV_FETCH_LIMIT: z.coerce.number().default(100),
  SCORE_THRESHOLD: z.coerce.number().default(7),
  APPS_OUTPUT_DIR: z.string().default("~/arxiv-apps"),
});

export const config = envSchema.parse(process.env);
export type Config = z.infer<typeof envSchema>;
