"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type StylePopularity = {
  style: string;
  pct: number;
  count: number;
};

type HeatmapCell = {
  day: string;
  bucket: string;
  pct: number;
};

type HeatmapData = {
  days: string[];
  rows: string[];
  matrix: HeatmapCell[][];
};

type TopStudio = {
  name: string;
  classes: number;
  pct: number;
};

type StyleTrend = {
  id: string;
  month: string;
  style: string;
  pct: number;
};

const palette = ["#4d63ff", "#9b59f5", "#22c55e", "#ff9b54", "#e05d5d", "#e8b923"];

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${url}`);
  }

  return response.json() as Promise<T>;
}

export default function Home() {
  const [stylesData, setStylesData] = useState<StylePopularity[]>([]);
  const [heatmap, setHeatmap] = useState<HeatmapData | null>(null);
  const [studios, setStudios] = useState<TopStudio[]>([]);
  const [trend, setTrend] = useState<StyleTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCell, setActiveCell] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getJson<StylePopularity[]>("/api/insights/style-popularity"),
      getJson<HeatmapData>("/api/insights/heatmap"),
      getJson<TopStudio[]>("/api/insights/top-studios"),
      getJson<StyleTrend[]>("/api/insights/style-trend"),
    ])
      .then(([stylePopularity, heatmapData, topStudios, styleTrend]) => {
        setStylesData(stylePopularity);
        setHeatmap(heatmapData);
        setStudios(topStudios);
        setTrend(styleTrend);
      })
      .catch(() => {
        setError("Could not load insights yet.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const topStyle = stylesData[0];

  const fullestSlot = useMemo(() => {
    if (!heatmap) return null;

    return heatmap.matrix
      .flat()
      .reduce<HeatmapCell | null>((best, cell) => {
        if (!best || cell.pct > best.pct) return cell;
        return best;
      }, null);
  }, [heatmap]);

  const latestTrend = useMemo(() => {
    const latestMonth = trend.at(-1)?.month;
    if (!latestMonth) return [];

    return trend
      .filter((item) => item.month === latestMonth)
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 4);
  }, [trend]);

  return (
    <main className={styles.shell}>
      <section className={styles.device} aria-label="Werk insights dashboard">
        <div className={styles.statusbarRow}>
          <div className={styles.statusbar}>
            <span>16:43</span>
            <span className={styles.statusCenter}>werk.dance - Private</span>
            <span className={styles.statusIcons}>
              5G <span className={styles.battery}><span /></span>
            </span>
          </div>
        </div>

        <header className={styles.topbar}>
          <div className={styles.logoWrap}>
            <div className={styles.logo} aria-label="Werk">
              <svg viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2 3 L10 24 L16 10 L22 24 L30 3"
                  stroke="currentColor"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="32" cy="4" r="3.2" fill="currentColor" />
              </svg>
            </div>
            <div className={styles.hamburger} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className={styles.avatar} />
        </header>

        <h1 className={styles.title}>Dashboard</h1>

        <nav className={styles.tabs} aria-label="Dashboard tabs">
          <span className={styles.tab}>Overview</span>
          <span className={styles.tab}>Events</span>
          <span className={styles.tab}>Bookings</span>
          <span className={styles.tab}>Programs</span>
          <span className={styles.tab}>Finances</span>
          <span className={`${styles.tab} ${styles.newTab} ${styles.activeTab}`}>
            Insights <span className={styles.sparkle} />
          </span>
        </nav>

        <div className={styles.content}>
          <div className={styles.eyebrow}>
            <span className={styles.dot} />
            New - Beta
          </div>
          <h2 className={styles.sectionHead}>What&apos;s working</h2>
          <p className={styles.sectionSub}>
            A read on your teaching business - pulled from generated events and bookings.
          </p>

          {error ? <div className={styles.error}>{error}</div> : null}

          <div className={styles.statRow}>
            <div className={styles.statCard}>
              <div className={styles.label}>Best-selling style</div>
              <div className={styles.value}>
                {loading ? "Loading" : topStyle?.style ?? "No data"}
                {topStyle ? <span className={styles.unit}>- {topStyle.pct}%</span> : null}
              </div>
              <div className={styles.trend}>Generated from bookings</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.label}>Fullest slot</div>
              <div className={styles.value}>
                {loading ? "Loading" : fullestSlot ? `${fullestSlot.day} ${fullestSlot.bucket}` : "No data"}
                {fullestSlot ? <span className={styles.unit}>- {fullestSlot.pct}%</span> : null}
              </div>
              <div className={styles.trend}>Avg fill rate</div>
            </div>
          </div>

          <section className={styles.card}>
            <div className={styles.cardTitle}>Style popularity</div>
            <div className={styles.cardSub}>Share of tickets sold from seeded bookings</div>
            {loading ? (
              <div className={styles.loading}>Loading...</div>
            ) : (
              stylesData.map((item, index) => (
                <div className={styles.barRow} key={item.style}>
                  <div className={styles.swatch} style={{ background: palette[index % palette.length] }} />
                  <div className={styles.barLabel}>{item.style}</div>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: `${item.pct}%`,
                        background: palette[index % palette.length],
                      }}
                    />
                  </div>
                  <div className={styles.barPct}>{item.pct}%</div>
                </div>
              ))
            )}
          </section>

          <section className={`${styles.card} ${styles.heatmap}`}>
            <div className={styles.cardTitle}>Best time to schedule</div>
            <div className={styles.cardSub}>Average fill rate by day and time</div>
            {loading || !heatmap ? (
              <div className={styles.loading}>Loading...</div>
            ) : (
              <div className={styles.heatmapGrid}>
                <div />
                {heatmap.days.map((day, index) => (
                  <div className={styles.hd} key={`${day}-${index}`}>
                    {day}
                  </div>
                ))}
                {heatmap.matrix.map((row, rowIndex) => (
                  <div className={styles.heatmapRow} key={heatmap.rows[rowIndex]}>
                    <div className={styles.rowLabel}>{heatmap.rows[rowIndex]}</div>
                    {row.map((cell) => {
                      const key = `${cell.bucket}-${cell.day}`;
                      const alpha = 0.08 + (cell.pct / 100) * 0.85;

                      return (
                        <button
                          className={`${styles.cell} ${activeCell === key ? styles.showCell : ""}`}
                          key={key}
                          onClick={() => {
                            setActiveCell(activeCell === key ? null : key);
                          }}
                          style={{ background: `rgba(77, 99, 255, ${alpha.toFixed(2)})` }}
                          type="button"
                        >
                          <span className={styles.tooltip}>{cell.pct}% full</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
            <div className={styles.legendScale}>
              Emptier <div className={styles.ramp} /> Fuller
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardTitle}>Top studios</div>
            <div className={styles.cardSub}>Where your classes fill up fastest</div>
            {loading ? (
              <div className={styles.loading}>Loading...</div>
            ) : (
              studios.map((studio, index) => (
                <div className={styles.studioRow} key={studio.name}>
                  <div className={`${styles.rank} ${index === 0 ? styles.gold : ""}`}>{index + 1}</div>
                  <div className={styles.studioInfo}>
                    <div className={styles.studioName}>{studio.name}</div>
                    <div className={styles.studioMeta}>
                      {studio.classes} classes - avg {studio.pct}% full
                    </div>
                  </div>
                  <div className={styles.studioFill}>{studio.pct}%</div>
                </div>
              ))
            )}
          </section>

          <section className={styles.card}>
            <div className={styles.cardTitle}>This month&apos;s style mix</div>
            <div className={styles.cardSub}>Share of scheduled classes by dance style</div>
            {loading ? (
              <div className={styles.loading}>Loading...</div>
            ) : (
              <div className={styles.trendGrid}>
                {latestTrend.map((item, index) => (
                  <div className={styles.trendItem} key={`${item.month}-${item.style}`}>
                    <div className={styles.trendTop}>
                      <span>{item.style}</span>
                      <span>{item.pct}%</span>
                    </div>
                    <div className={styles.trendTrack}>
                      <div
                        className={styles.trendFill}
                        style={{
                          width: `${item.pct}%`,
                          background: palette[index % palette.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </section>
    </main>
  );
}
