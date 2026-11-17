import { useState } from 'react';
import type { DashboardSummary } from '../../types';
import { rupiah, rupiahRingkas } from '../../utils/format';

type Row = DashboardSummary['bulanan'][number];

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const namaBulan = (bulan: string) => BULAN[Number(bulan.slice(5)) - 1] ?? bulan;

const ACTIVITY_SERIES = [
  { key: 'request' as const, label: 'Request Masuk', color: '#fbbf24', gradId: 'grad-request' },
  { key: 'projek' as const, label: 'Projek Masuk', color: '#ff6200', gradId: 'grad-projek' },
  { key: 'selesai' as const, label: 'Projek Selesai', color: '#34d399', gradId: 'grad-selesai' },
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
  // Bulatkan batas atas ke bilangan genap agar garis bantu rapi.
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
    <div className="flex flex-col justify-between rounded-[22px] border border-white/10 bg-coal-deep p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-cream sm:text-lg">Tren Aktivitas Proyek</h2>
          <p className="text-xs text-cream/60">Perbandingan request, projek berjalan, dan projek selesai tiap bulan</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-cream/85">
          {ACTIVITY_SERIES.map((series) => (
            <span key={series.key} className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: series.color }} />
              {series.label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-[clamp(180px,34vh,280px)] w-full overflow-visible" role="img" aria-label="Grafik tren aktivitas proyek per bulan">
          <defs>
            {ACTIVITY_SERIES.map((series) => (
              <linearGradient key={series.gradId} id={series.gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={series.color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={series.color} stopOpacity="0.0" />
              </linearGradient>
            ))}
          </defs>

          {/* Garis bantu horizontal dan angka sumbu Y */}
          {uniqueTicks.map((tick) => {
            const y = baseY - (tick / maxVal) * plotH;
            return (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,245,0.08)"
                  strokeDasharray={tick === 0 ? undefined : '4 4'}
                />
                <text x={PAD.left - 10} y={y + 4} textAnchor="end" className="fill-cream/50 text-[11px]">
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Kurva area dan garis */}
          {ACTIVITY_SERIES.map((series) => {
            const pts = toPoints(series.key);
            return (
              <g key={series.key}>
                <path d={smoothArea(pts, baseY)} fill={`url(#${series.gradId})`} />
                <path d={smoothCurve(pts)} fill="none" stroke={series.color} strokeWidth={2.5} strokeLinecap="round" />
              </g>
            );
          })}

          {/* Garis vertikal saat kursor diarahkan */}
          {hover !== null && (
            <line
              x1={PAD.left + hover * stepX}
              x2={PAD.left + hover * stepX}
              y1={PAD.top}
              y2={baseY}
              stroke="rgba(255,255,245,0.25)"
              strokeDasharray="3 3"
            />
          )}

          {/* Titik data dan label bulan di sumbu X */}
          {bulanan.map((row, idx) => {
            const x = PAD.left + idx * stepX;
            const isHover = hover === idx;
            return (
              <g key={row.bulan}>
                <text
                  x={x}
                  y={H - 8}
                  textAnchor="middle"
                  className={`text-[11px] transition-colors ${isHover ? 'fill-flame font-semibold' : 'fill-cream/65'}`}
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
                      fill="#1e1e1e"
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
            className="pointer-events-none absolute top-1 z-10 w-48 rounded-xl border border-white/15 bg-[#1b1b1d]/95 p-3 text-xs text-cream shadow-xl backdrop-blur-sm"
            style={{ left: `clamp(0px, calc(${((PAD.left + hover * stepX) / W) * 100}% - 6rem), calc(100% - 12rem))` }}
          >
            <p className="mb-1.5 font-semibold text-flame">
              {namaBulan(bulanan[hover].bulan)} {bulanan[hover].bulan.slice(0, 4)}
            </p>
            {ACTIVITY_SERIES.map((series) => (
              <div key={series.key} className="flex items-center justify-between py-0.5">
                <span className="inline-flex items-center gap-1.5 text-cream/80">
                  <span className="size-2 rounded-full" style={{ backgroundColor: series.color }} />
                  {series.label}
                </span>
                <span className="font-semibold text-cream">{bulanan[hover][series.key]}</span>
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
  // Bulatkan ke jutaan terdekat agar label sumbu Y mudah dibaca.
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
    <div className="flex flex-col justify-between rounded-[22px] border border-white/10 bg-coal-deep p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-cream sm:text-lg">Tren Keuntungan Bulanan</h2>
          <p className="text-xs text-cream/60">Total pembayaran terverifikasi yang masuk tiap bulan</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-flame/15 px-3 py-1 text-xs font-medium text-flame">
          <span className="size-2 rounded-full bg-flame" />
          Pemasukan (Rp)
        </span>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-[clamp(180px,34vh,280px)] w-full overflow-visible" role="img" aria-label="Grafik keuntungan bulanan">
          <defs>
            <linearGradient id="grad-bar-revenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6200" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ff6200" stopOpacity="0.2" />
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
                  stroke="rgba(255,255,245,0.08)"
                  strokeDasharray={tick === 0 ? undefined : '4 4'}
                />
                <text x={PAD.left - 8} y={y + 4} textAnchor="end" className="fill-cream/50 text-[11px]">
                  {tick === 0 ? '0' : rupiahRingkas(tick)}
                </text>
              </g>
            );
          })}

          {/* Batang bulanan */}
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
                  fill={row.pemasukan > 0 ? 'url(#grad-bar-revenue)' : 'rgba(255,255,245,0.08)'}
                  opacity={hover === null || isHover ? 1 : 0.55}
                />
                {row.pemasukan > 0 && (
                  <text
                    x={centerX}
                    y={y - 6}
                    textAnchor="middle"
                    className={`text-[10px] font-medium ${isHover ? 'fill-flame' : 'fill-cream/75'}`}
                  >
                    {rupiahRingkas(row.pemasukan)}
                  </text>
                )}
                <text
                  x={centerX}
                  y={H - 8}
                  textAnchor="middle"
                  className={`text-[11px] transition-colors ${isHover ? 'fill-flame font-semibold' : 'fill-cream/65'}`}
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

          {/* Garis kurva penghubung di atas batang */}
          <path d={smoothCurve(points)} fill="none" stroke="#ffd27a" strokeWidth={2} strokeOpacity={0.75} />
          {points.map((pt, idx) => (
            <circle
              key={bulanan[idx].bulan}
              cx={pt.x}
              cy={pt.y}
              r={hover === idx ? 4.5 : 2.8}
              fill="#1e1e1e"
              stroke="#ffd27a"
              strokeWidth={2}
            />
          ))}
        </svg>

        {hover !== null && (
          <div
            className="pointer-events-none absolute top-1 z-10 w-48 rounded-xl border border-white/15 bg-[#1b1b1d]/95 p-3 text-xs text-cream shadow-xl backdrop-blur-sm"
            style={{ left: `clamp(0px, calc(${((PAD.left + hover * slotW + slotW / 2) / W) * 100}% - 6rem), calc(100% - 12rem))` }}
          >
            <p className="mb-1 font-semibold text-flame">
              {namaBulan(bulanan[hover].bulan)} {bulanan[hover].bulan.slice(0, 4)}
            </p>
            <p className="text-cream/75">Keuntungan terverifikasi:</p>
            <p className="mt-0.5 text-sm font-bold text-cream">{rupiah(bulanan[hover].pemasukan)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrendBands({ bulanan }: { bulanan: Row[] }) {
  return (
    <section aria-label="Grafik perkembangan bulanan">
      <div className="grid gap-4 lg:grid-cols-2">
        <ActivityChart bulanan={bulanan} />
        <RevenueChart bulanan={bulanan} />
      </div>

      {/* Tabel untuk pembaca layar. */}
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
