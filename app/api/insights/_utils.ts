import { prisma } from "@/app/lib/prisma";

export const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
export const timeBuckets = ["AM", "Mid", "Eve", "Night"] as const;

export function round1(value: number) {
  return Math.round(value * 10) / 10;
}

export function fillRate(event: { booked: number; capacity: number }) {
  if (event.capacity <= 0) return 0;
  return (event.booked / event.capacity) * 100;
}

export function timeBucket(startTime: string): (typeof timeBuckets)[number] {
  const hour = Number(startTime.split(":")[0]);

  if (hour < 12) return "AM";
  if (hour < 17) return "Mid";
  if (hour < 21) return "Eve";
  return "Night";
}

export async function getEventsWithStudio() {
  return prisma.event.findMany({
    include: {
      studio: true,
    },
  });
}
