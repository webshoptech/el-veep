import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let ip =
    req.headers.get("x-vercel-forwarded-for") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip");

  if (!ip && process.env.NODE_ENV === "development") {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      ip = data.ip;
    } catch {
      ip = "102.0.14.104";
    }
  }

  return NextResponse.json({ ip: ip || "Unknown IP" });
}
