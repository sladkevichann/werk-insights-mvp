import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const result = await prisma.styleTrend.findMany({
    orderBy: [{ month: "asc" }, { pct: "desc" }],
  });

  return NextResponse.json(result);
}
