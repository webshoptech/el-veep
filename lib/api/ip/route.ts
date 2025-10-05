import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Try to detect the real client IP address from common proxy headers
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");

  const ip =
    forwardedFor?.split(",")[0]?.trim() ||
    realIp ||
    // fallback: using server-side environment (not available in edge runtimes)
    (process.env.NODE_ENV === "development" ? "127.0.0.1" : "Unknown IP");

  return NextResponse.json({ ip });
}
