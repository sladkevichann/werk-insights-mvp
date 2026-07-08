import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { round1 } from "../_utils";

export const runtime = "nodejs";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: {
      event: true,
    },
  });

  const counts = new Map<string, number>();

  for (const booking of bookings) {
    counts.set(booking.event.style, (counts.get(booking.event.style) ?? 0) + 1);
  }

  const total = bookings.length || 1;
  const result = [...counts.entries()]
    .map(([style, count]) => ({
      style,
      pct: round1((count / total) * 100),
      count,
    }))
    .sort((a, b) => b.pct - a.pct);

  return NextResponse.json(result);
}
