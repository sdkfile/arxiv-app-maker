import { Polar } from "@polar-sh/sdk";

const accessToken = process.env.POLAR_ACCESS_TOKEN;
if (!accessToken) {
  throw new Error("Missing POLAR_ACCESS_TOKEN");
}

export const polar = new Polar({ accessToken });

export async function createCheckout(productId: string, successUrl: string) {
  return polar.checkouts.custom.create({
    productId,
    successUrl,
  });
}
