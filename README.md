# Werk Insights MVP

A mobile-first analytics prototype for Werk that turns class, booking, studio, and student data into actionable insights for dance teachers.

## Overview

Werk Insights explores how Werk could help dance teachers understand what is working in their business, not just manage the operations of listing classes and collecting payments.

The MVP uses generated demo data to power an `Insights` tab with metrics around style demand, schedule performance, studio performance, and monthly trends.

## Features

- Style popularity based on booking share
- Best scheduling windows based on class fill rate
- Top studio ranking by average fill rate
- Monthly style trend data
- Mobile-first dashboard UI inspired by Werk's product experience
- Seeded local database with realistic demo data

## Tech Stack

- Next.js
- React
- TypeScript
- Prisma ORM
- SQLite
- Python
- Pandas
- Faker

## Architecture

```text
Python data generation
        -> JSON demo datasets
        -> Prisma seed script
        -> SQLite database
        -> Next.js API routes
        -> React dashboard
```

## Project Structure

```text
app/
  api/insights/        Insight API routes
  lib/prisma.ts        Prisma client setup
  page.tsx             Dashboard UI
  page.module.css      Dashboard styles

data-pipeline/
  generate_data.py     Generates demo students, events, and bookings
  analyze_trend.py     Calculates monthly style trend data
  *.json               Generated demo datasets

prisma/
  schema.prisma        Database schema
  seed.ts              Loads demo data into SQLite
  migrations/          Database migration history
```

## Getting Started

Create a local environment file:

```bash
cp .env.example .env
```

Install dependencies:

```bash
npm install
```

This installs the project dependencies, including Prisma.

Generate the Prisma client:

```bash
npm run prisma:generate
```

Seed the local database:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev      # Start the development server
npm run build    # Build the app for production
npm run lint     # Run ESLint
npm run prisma:generate # Generate the Prisma client
npm run seed     # Seed the local SQLite database
```

## Data Model

The MVP models the core entities needed for analytics:

- `Studio`
- `Instructor`
- `Student`
- `Event`
- `Booking`
- `StyleTrend`

These entities are intentionally close to real marketplace and scheduling concepts, so the prototype could be adapted to production data sources later.

## Current Limitations

- Uses generated demo data instead of production Werk data
- No authentication or teacher-specific accounts
- No live Stripe integration
- Insights are descriptive, not predictive
- No automated test coverage yet
- UI is optimized for a mobile product demo

## Next Steps

- Connect the dashboard to real Werk event and booking data
- Add teacher-level filtering and date ranges
- Add revenue and payment metrics
- Add recommendation logic for scheduling and programming decisions
- Add tests for insight calculations
- Expand the layout for a production desktop dashboard if needed
