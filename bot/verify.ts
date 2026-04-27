import { subtle } from "crypto";
import type { Context, Next } from "hono";
import { config } from "../shared/config.js";

async function verifyKey(
  body: string,
  signature: string,
  timestamp: string,
  publicKey: string
): Promise<boolean> {
  try {
    const key = await subtle.importKey(
      "raw",
      Buffer.from(publicKey, "hex"),
      { name: "Ed25519" },
      false,
      ["verify"]
    );
    const data = Buffer.from(timestamp + body);
    const sig = Buffer.from(signature, "hex");
    return await subtle.verify("Ed25519", key, sig, data);
  } catch {
    return false;
  }
}

type Env = { Variables: { parsedBody: any } };

export function verifyDiscordRequest(_app: { use: Function }) {
  return async (c: Context<Env>, next: Next) => {
    const signature = c.req.header("X-Signature-Ed25519") ?? "";
    const timestamp = c.req.header("X-Signature-Timestamp") ?? "";
    const body = await c.req.text();

    const publicKey = config.DISCORD_PUBLIC_KEY;
    if (!publicKey) {
      return c.json({ error: "DISCORD_PUBLIC_KEY not configured" }, 500);
    }

    const isValid = await verifyKey(body, signature, timestamp, publicKey);
    if (!isValid) {
      return c.json({ error: "Invalid request signature" }, 401);
    }

    c.set("parsedBody", JSON.parse(body));
    await next();
  };
}
