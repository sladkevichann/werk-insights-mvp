import "dotenv/config"
// importinf PrismaClient - generated code, w which we can reach data base
import { fileURLToPath } from "url"
import { PrismaClient } from "../app/generated/prisma/client.ts"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
// Module in Node.js to read files from the disk

import fs from "fs"

// Module in Node.js to determine paths to files
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set")
}

// making one PrismaClient for requesting data vase
const adapter = new PrismaBetterSqlite3({ url: databaseUrl })
const prisma = new PrismaClient({ adapter })

type StudentRow = {
    id: string
    name: string
    email: string
}

type EventRow = {
    id: string
    title: string
    style: string
    level: string
    day_of_week: string
    start_time: string
    date: string
    price: number
    capacity: number
    booked: number
    studio: string
    instructor: string
}

type BookingRow = {
    id: string
    status: string
    amount: number
    booked_at: string
    event_id: string
    student_id: string
}

type StyleTrendRow = {
    month: string
    style: string
    pct: number
}

// path to data pipeline w JSON files
// __dirname = directory w prisma
const DATA_DIR = path.join(__dirname, "..", "data-pipeline")

// helper f to get name of file as a string and returns it contents
function loadJson<T>(filename: string): T {
    const filePath = path.join(DATA_DIR, filename)

    const raw = fs.readFileSync(filePath, "utf-8")

    return JSON.parse(raw) as T
}

// async - inside you can use await (wait for the end of operations with data base)
async function main() {
    console.log("Reading JSON-files...")

    const students = loadJson<StudentRow[]>("students.json")
    const events = loadJson<EventRow[]>("events.json")
    const bookings = loadJson<BookingRow[]>("bookings.json")
    const styleTrend = loadJson<StyleTrendRow[]>("style_trend.json")

    console.log("Clearing old demo data...")

    await prisma.booking.deleteMany()
    await prisma.event.deleteMany()
    await prisma.styleTrend.deleteMany()
    await prisma.student.deleteMany()
    await prisma.instructor.deleteMany()
    await prisma.studio.deleteMany()

    const studioNames: string[] = [...new Set(events.map((e) => e.studio))]

    const instructorNames: string[] = [...new Set(events.map((e) => e.instructor))]

    console.log(`Making ${studioNames.length} studios...`)

    for (const name of studioNames) {
        await prisma.studio.upsert({
            where: { name },
            update: {},
            create: { name }
        })
    }

    console.log(`Making ${instructorNames.length} instructors...`)
    for (const name of instructorNames) {
        await prisma.instructor.upsert({
            where: { name },
            update: {},
            create: { name },
        })
    }

    console.log(`Making ${students.length} students...`)
    for (const s of students) {
        await prisma.student.upsert({
            where: { email: s.email },
            update: {},
            create: {
                id: s.id,
                name: s.name,
                email: s.email,
            },
        })
    }

    console.log(`Making ${events.length} events...`)

    for (const e of events) {
        const studio = await prisma.studio.findUnique({ where: { name: e.studio } })
        
        const instructor = await prisma.instructor.findUnique({ where: { name: e.instructor } })

        if (!studio || !instructor) continue

        await prisma.event.upsert({
            where: { id: e.id },
            update: {},
            create: {
            id: e.id,
            title: e.title,
            style: e.style,
            level: e.level,
            dayOfWeek: e.day_of_week,
            startTime: e.start_time,
            date: new Date(e.date),
            price: e.price,
            capacity: e.capacity,
            booked: e.booked,
            studioId: studio.id, 
            instructorId: instructor.id,
        },
    })
}
    console.log(`Making ${bookings.length} bookings...`)

    for (const b of bookings) {
    await prisma.booking.upsert({
      where: { id: b.id },
      update: {},
      create: {
        id: b.id,
        status: b.status,
        amount: b.amount,
        bookedAt: new Date(b.booked_at),
        eventId: b.event_id,
        studentId: b.student_id, 
        },
    })
  }
    console.log(`Making ${styleTrend.length} trend notes...`)

    for (const t of styleTrend) {
       await prisma.styleTrend.create({
        data: {
            month: t.month,
            style: t.style,
            pct: t.pct,
        },
    })
  } 

  console.log("Ready! All data is in the base.")

}

main()

    .catch((e) => {
    console.error(e)
    process.exit(1)
})
.finally(async () => {
    await prisma.$disconnect()
    })
