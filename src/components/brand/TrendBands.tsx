import { useState } from 'react';
import type { DashboardSummary } from '../../types';
import { rupiah, rupiahRingkas } from '../../utils/format';

type Row = DashboardSummary['bulanan'][number];

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const namaBulan = (bulan: string) => BULAN[Number(bulan.slice(5)) - 1] ?? bulan;

const ACTIVITY_SERIES = [
  { key: 'request' as const, label: 'Request Masuk', color: '#f59e0b', gradId: 'grad-request' },
  { key: 'projek' as const, label: 'Projek Masuk', color: '#ff6200', gradId: 'grad-projek' },
  { key: 'selesai' as const, label: 'Projek Selesai', color: '#10b981', gradId: 'grad-selesai' },
];

interface Point {
  x: number;
  y: number;
  value: number;
}

/** Menghasilkan kurva halus (cubic bezier) melewati setiap titik agar grafik terlihat modern dan nyaman di mata. */
function smoothCurve(points: Point[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = ((p0.x + p1.x) / 2).toFixed(1);
    d += ` C ${cx} ${p0.y.toFixed(1)}, ${cx} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  return d;
}

function smoothArea(points: Point[], baselineY: number): string {
  if (points.length === 0) return '';
  const line = smoothCurve(points);
  const first = points[0];
  const last = points[points.length - 1];
  return `${line} L ${last.x.toFixed(1)} ${baselineY.toFixed(1)} L ${first.x.toFixed(1)} ${baselineY.toFixed(1)} Z`;
}

function ActivityChart({ bulanan }: { bulanan: Row[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 560;
  const H = 240;
  const PAD = { top: 20, right: 20, bottom: 34, left: 36 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const baseY = PAD.top + plotH;

  const rawMax = Math.max(
    4,
    ...bulanan.flatMap((row) => [row.request, row.projek, row.selesai]),
  );
  const maxVal = rawMax <= 4 ? 4 : Math.ceil(rawMax / 2) * 2;
  const ticks = [0, Math.round(maxVal * 0.25), Math.round(maxVal * 0.5), Math.round(maxVal * 0.75), maxVal];
  const uniqueTicks = Array.from(new Set(ticks));

  const stepX = plotW / Math.max(bulanan.length - 1, 1);
  const toPoints = (key: 'request' | 'projek' | 'selesai'): Point[] =>
    bulanan.map((row, idx) => ({
      x: PAD.left + idx * stepX,
      y: baseY - (row[key] / maxVal) * plotH,
      value: row[key],
    }));

  return (
    <div className="flex flex-1 flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-xs sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 sm:text-base">Tren Aktivitas Proyek</h2>
          <p className="text-xs text-zinc-500">Perbandingan request, projek berjalan, dan projek selesai tiap bulan</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-zinc-600">
          {ACTIVITY_SERIES.map((series) => (
            <span key={series.key} className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: series.color }} />
              {series.label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-[clamp(185px,35vh,285px)] w-full overflow-visible" role="img" aria-label="Grafik tren aktivitas proyek per bulan">
          <defs>
            {ACTIVITY_SERIES.map((series) => (
              <linearGradient key={series.gradId} id={series.gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={series.color} stopOpacity="0.16" />
                <stop offset="100%" stopColor={series.color} stopOpacity="0.0" />
              </linearGradient>
            ))}
          </defs>

          {uniqueTicks.map((tick) => {
            const y = baseY - (tick / maxVal) * plotH;
            return (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={y}
                  y2={y}
                  stroke="#e4e4e7"
                  strokeDasharray={tick === 0 ? undefined : '4 4'}
                />
                <text x={PAD.left - 10} y={y + 4} textAnchor="end" className="fill-zinc-400 text-[11px]">
                  {tick}
                </text>
              </g>
            );
          })}

          {ACTIVITY_SERIES.map((series) => {
            const pts = toPoints(series.key);
            return (
              <g key={series.key}>
                <path d={smoothArea(pts, baseY)} fill={`url(#${series.gradId})`} />
                <path d={smoothCurve(pts)} fill="none" stroke={series.color} strokeWidth={2.5} strokeLinecap="round" />
              </g>
            );
          })}

          {hover !== null && (
            <line
              x1={PAD.left + hover * stepX}
              x2={PAD.left + hover * stepX}
              y1={PAD.top}
              y2={baseY}
              stroke="#a1a1aa"
              strokeDasharray="3 3"
            />
          )}

          {bulanan.map((row, idx) => {
            const x = PAD.left + idx * stepX;
            const isHover = hover === idx;
            return (
              <g key={row.bulan}>
                <text
                  x={x}
                  y={H - 8}
                  textAnchor="middle"
                  className={`text-[11px] transition-colors ${isHover ? 'fill-flame font-semibold' : 'fill-zinc-500'}`}
                >
                  {namaBulan(row.bulan)}
                </text>
                {ACTIVITY_SERIES.map((series) => {
                  const y = baseY - (row[series.key] / maxVal) * plotH;
                  return (
                    <circle
                      key={series.key}
                      cx={x}
                      cy={y}
                      r={isHover ? 5 : 3.2}
                      fill="#ffffff"
                      stroke={series.color}
                      strokeWidth={isHover ? 2.8 : 2}
                    />
                  );
                })}
                <rect
                  x={x - stepX / 2}
                  y={PAD.top}
                  width={stepX}
                  height={plotH}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHover(idx)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(idx)}
                  onBlur={() => setHover(null)}
                  tabIndex={0}
                  aria-label={`${namaBulan(row.bulan)}: Request ${row.request}, Projek ${row.projek}, Selesai ${row.selesai}`}
                />
              </g>
            );
          })}
        </svg>

        {hover !== null && (
          <div
            className="pointer-events-none absolute top-1 z-10 w-48 rounded-xl border border-zinc-200 bg-white/95 p-3 text-xs text-zinc-700 shadow-lg backdrop-blur-sm"
            style={{ left: `clamp(0px, calc(${((PAD.left + hover * stepX) / W) * 100}% - 6rem), calc(100% - 12rem))` }}
          >
            <p className="mb-1.5 font-semibold text-zinc-900">
              {namaBulan(bulanan[hover].bulan)} {bulanan[hover].bulan.slice(0, 4)}
            </p>
            {ACTIVITY_SERIES.map((series) => (
              <div key={series.key} className="flex items-center justify-between py-0.5">
                <span className="inline-flex items-center gap-1.5 text-zinc-600">
                  <span className="size-2 rounded-full" style={{ backgroundColor: series.color }} />
                  {series.label}
                </span>
                <span className="font-semibold text-zinc-900">{bulanan[hover][series.key]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RevenueChart({ bulanan }: { bulanan: Row[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 560;
  const H = 240;
  const PAD = { top: 24, right: 16, bottom: 34, left: 54 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const baseY = PAD.top + plotH;

  const values = bulanan.map((row) => row.pemasukan);
  const rawMax = Math.max(1_000_000, ...values);
  const stepMillion = rawMax <= 5_000_000 ? 1_000_000 : rawMax <= 20_000_000 ? 5_000_000 : 10_000_000;
  const maxVal = Math.ceil(rawMax / stepMillion) * stepMillion;
  const ticks = [0, Math.round(maxVal * 0.5), maxVal];

  const slotW = plotW / Math.max(bulanan.length, 1);
  const barW = Math.min(34, slotW * 0.52);

  const points: Point[] = bulanan.map((row, idx) => ({
    x: PAD.left + idx * slotW + slotW / 2,
    y: baseY - (row.pemasukan / maxVal) * plotH,
    value: row.pemasukan,
  }));

  return (
    <div className="flex flex-1 flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-xs sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 sm:text-base">Tren Keuntungan Bulanan</h2>
          <p className="text-xs text-zinc-500">Total pembayaran terverifikasi yang masuk tiap bulan</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-flame/20 bg-flame/10 px-3 py-0.5 text-xs font-medium text-flame">
          <span className="size-2 rounded-full bg-flame" />
          Pemasukan (Rp)
        </span>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-[clamp(185px,35vh,285px)] w-full overflow-visible" role="img" aria-label="Grafik keuntungan bulanan">
          <defs>
            <linearGradient id="grad-bar-revenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6200" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ff8533" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {ticks.map((tick) => {
            const y = baseY - (tick / maxVal) * plotH;
            return (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={y}
                  y2={y}
                  stroke="#e4e4e7"
                  strokeDasharray={tick === 0 ? undefined : '4 4'}
                />
                <text x={PAD.left - 8} y={y + 4} textAnchor="end" className="fill-zinc-400 text-[11px]">
                  {tick === 0 ? '0' : rupiahRingkas(tick)}
                </text>
              </g>
            );
          })}

          {bulanan.map((row, idx) => {
            const centerX = PAD.left + idx * slotW + slotW / 2;
            const barH = Math.max(row.pemasukan > 0 ? 6 : 2, (row.pemasukan / maxVal) * plotH);
            const y = baseY - barH;
            const isHover = hover === idx;
            return (
              <g key={row.bulan}>
                <rect
                  x={centerX - barW / 2}
                  y={y}
                  width={barW}
                  height={barH}
                  rx={6}
                  fill={row.pemasukan > 0 ? 'url(#grad-bar-revenue)' : '#e4e4e7'}
                  opacity={hover === null || isHover ? 1 : 0.55}
                />
                {row.pemasukan > 0 && (
                  <text
                    x={centerX}
                    y={y - 6}
                    textAnchor="middle"
                    className={`text-[10px] font-semibold ${isHover ? 'fill-flame' : 'fill-zinc-600'}`}
                  >
                    {rupiahRingkas(row.pemasukan)}
                  </text>
                )}
                <text
                  x={centerX}
                  y={H - 8}
                  textAnchor="middle"
                  className={`text-[11px] transition-colors ${isHover ? 'fill-flame font-semibold' : 'fill-zinc-500'}`}
                >
                  {namaBulan(row.bulan)}
                </text>
                <rect
                  x={PAD.left + idx * slotW}
                  y={PAD.top}
                  width={slotW}
                  height={plotH}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHover(idx)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(idx)}
                  onBlur={() => setHover(null)}
                  tabIndex={0}
                  aria-label={`${namaBulan(row.bulan)}: Keuntungan ${rupiah(row.pemasukan)}`}
                />
              </g>
            );
          })}

          <path d={smoothCurve(points)} fill="none" stroke="#ff6200" strokeWidth={2} strokeOpacity={0.5} />
          {points.map((pt, idx) => (
            <circle
              key={bulanan[idx].bulan}
              cx={pt.x}
              cy={pt.y}
              r={hover === idx ? 4.5 : 2.8}
              fill="#ffffff"
              stroke="#ff6200"
              strokeWidth={2}
            />
          ))}
        </svg>

        {hover !== null && (
          <div
            className="pointer-events-none absolute top-1 z-10 w-48 rounded-xl border border-zinc-200 bg-white/95 p-3 text-xs text-zinc-700 shadow-lg backdrop-blur-sm"
            style={{ left: `clamp(0px, calc(${((PAD.left + hover * slotW + slotW / 2) / W) * 100}% - 6rem), calc(100% - 12rem))` }}
          >
            <p className="mb-1 font-semibold text-zinc-900">
              {namaBulan(bulanan[hover].bulan)} {bulanan[hover].bulan.slice(0, 4)}
            </p>
            <p className="text-zinc-500">Keuntungan terverifikasi:</p>
            <p className="mt-0.5 text-sm font-bold text-flame">{rupiah(bulanan[hover].pemasukan)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrendBands({ bulanan }: { bulanan: Row[] }) {
  return (
    <section aria-label="Grafik perkembangan bulanan" className="flex flex-1 flex-col">
      <div className="grid flex-1 gap-4 lg:grid-cols-2">
        <ActivityChart bulanan={bulanan} />
        <RevenueChart bulanan={bulanan} />
      </div>

      <div className="sr-only">
        <table>
          <thead>
            <tr>
              <th>Bulan</th>
              <th>Request masuk</th>
              <th>Projek masuk</th>
              <th>Projek selesai</th>
              <th>Keuntungan</th>
            </tr>
          </thead>
          <tbody>
            {bulanan.map((row) => (
              <tr key={row.bulan}>
                <td>{row.bulan}</td>
                <td>{row.request} request</td>
                <td>{row.projek} projek</td>
                <td>{row.selesai} projek</td>
                <td>{rupiah(row.pemasukan)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
