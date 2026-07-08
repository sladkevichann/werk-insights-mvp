import { NextResponse } from "next/server";
import {
  dayLabels,
  dayOrder,
  fillRate,
  getEventsWithStudio,
  round1,
  timeBucket,
  timeBuckets,
} from "../_utils";

export const runtime = "nodejs";

type Bucket = {
  total: number;
  count: number;
};

export async function GET() {
  const events = await getEventsWithStudio();
  const buckets = new Map<string, Bucket>();

  for (const event of events) {
    const key = `${timeBucket(event.startTime)}:${event.dayOfWeek}`;
    const bucket = buckets.get(key) ?? { total: 0, count: 0 };
    bucket.total += fillRate(event);
    bucket.count += 1;
    buckets.set(key, bucket);
  }

  const matrix = timeBuckets.map((bucketName) =>
    dayOrder.map((day) => {
      const bucket = buckets.get(`${bucketName}:${day}`);

      return {
        day,
        bucket: bucketName,
        pct: bucket ? round1(bucket.total / bucket.count) : 0,
      };
    }),
  );

  return NextResponse.json({
    days: dayLabels,
    rows: timeBuckets,
    matrix,
  });
}
