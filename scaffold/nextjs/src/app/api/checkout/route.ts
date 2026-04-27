import { NextRequest, NextResponse } from "next/server";
import { createCheckout } from "@/lib/polar";

export async function POST(req: NextRequest) {
  const productId = process.env.POLAR_PRODUCT_ID;
  if (!productId) {
    return NextResponse.json({ error: "Product not configured" }, { status: 500 });
  }

  const { successUrl } = await req.json();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkout = await createCheckout(
    productId,
    successUrl ?? `${baseUrl}/?upgraded=true`
  );

  return NextResponse.json({ url: checkout.url });
}
