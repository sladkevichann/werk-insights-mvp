import { NextResponse } from "next/server";
import { fillRate, getEventsWithStudio, round1 } from "../_utils";

export const runtime = "nodejs";

type StudioStats = {
  name: string;
  totalFill: number;
  classes: number;
};

export async function GET() {
  const events = await getEventsWithStudio();
  const stats = new Map<string, StudioStats>();

  for (const event of events) {
    const current =
      stats.get(event.studioId) ??
      ({
        name: event.studio.name,
        totalFill: 0,
        classes: 0,
      } satisfies StudioStats);

    current.totalFill += fillRate(event);
    current.classes += 1;
    stats.set(event.studioId, current);
  }

  const result = [...stats.values()]
    .map((studio) => ({
      name: studio.name,
      classes: studio.classes,
      pct: round1(studio.totalFill / studio.classes),
    }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  return NextResponse.json(result);
}
