import { useState } from 'react';
import type { DashboardSummary } from '../../types';
import { rupiah } from '../../utils/format';

// Grafik pita di Dashboard Marketing (Figma 148:820-148:824): empat pita bertumpuk, satu per kartu angka.
// Tiap pita berskala sendiri (small multiples), karena jumlah request dan rupiah tidak boleh berbagi satu sumbu.
// Tinggi pita = nilai bulan itu dibanding nilai tertinggi pita tersebut. Nilai asli tampil saat diarahkan.

type Row = DashboardSummary['bulanan'][number];
type Key = 'request' | 'projek' | 'selesai' | 'pemasukan';

const SERIES: { key: Key; short: string; label: string; format: (n: number) => string }[] = [
  { key: 'pemasukan', short: 'Keuntungan', label: 'Keuntungan', format: (n) => rupiah(n) },
  { key: 'selesai', short: 'Selesai', label: 'Projek selesai', format: (n) => `${n} projek` },
  { key: 'projek', short: 'Projek', label: 'Projek masuk', format: (n) => `${n} projek` },
  { key: 'request', short: 'Request', label: 'Request masuk', format: (n) => `${n} request` },
];

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Juni', 'Juli', 'Agus', 'Sept', 'Oct', 'Nov', 'Des'];
const W = 1000;
const BAND = 80;
const GAP = 2;
const H = SERIES.length * BAND;
const LABEL_W = 150;

function bandPath(values: number[], top: number) {
  const max = Math.max(...values, 0);
  const step = (W - LABEL_W) / Math.max(values.length - 1, 1);
  // Ruang 8px di atas pita agar puncak tidak menempel pita di atasnya.
  const y = (v: number) => top + BAND - GAP - (max ? (v / max) * (BAND - GAP - 8) : 0);
  const points = values.map((v, i) => `${i * step},${y(v).toFixed(1)}`);
  return {
    area: `M0,${top + BAND - GAP} L${points.join(' L')} L${W - LABEL_W},${top + BAND - GAP} Z`,
    line: `M${points.join(' L')}`,
  };
}

export default function TrendBands({ bulanan }: { bulanan: Row[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const step = (W - LABEL_W) / Math.max(bulanan.length - 1, 1);
  const nama = (bulan: string) => BULAN[Number(bulan.slice(5)) - 1];

  return (
    <figure className="rounded-[20px] border-[3px] border-coal-deep bg-coal-deep p-3">
      <figcaption className="sr-only">Perkembangan request, projek, projek selesai, dan keuntungan per bulan</figcaption>
      <div className="relative">
        {/* Tinggi mengikuti layar agar dashboard muat satu layar; label 01-04 berupa HTML supaya tidak ikut melar. */}
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-[clamp(140px,27vh,340px)] w-full" role="img" aria-label="Grafik perkembangan per bulan">
          {SERIES.map((series, index) => {
            const top = index * BAND;
            const { area, line } = bandPath(bulanan.map((row) => row[series.key]), top);
            const dark = index % 2 === 1;
            return (
              <g key={series.key}>
                {/* Pita gelap selang-seling seperti desain; isinya tetap oranye agar kontras di latar gelap. */}
                <rect x={0} y={top} width={W} height={BAND - GAP} fill={dark ? '#1c1c1c' : '#262626'} />
                <path d={area} fill="#ff6200" fillOpacity={dark ? 0.55 : 0.85} />
                <path d={line} fill="none" stroke="#ff6200" strokeWidth={2} vectorEffect="non-scaling-stroke" />
              </g>
            );
          })}
          {hover !== null && <line x1={hover * step} x2={hover * step} y1={0} y2={H} stroke="#fffff5" strokeWidth={2} strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />}
          {bulanan.map((row, index) => (
            <rect
              key={row.bulan}
              x={index * step - step / 2}
              y={0}
              width={step}
              height={H}
              fill="transparent"
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(index)}
              onBlur={() => setHover(null)}
              tabIndex={0}
              aria-label={`${nama(row.bulan)}: ${SERIES.map((s) => `${s.label} ${s.format(row[s.key])}`).join(', ')}`}
            />
          ))}
        </svg>
        {SERIES.map((series, index) => (
          <span
            key={series.key}
            aria-hidden="true"
            className="pointer-events-none absolute right-2 -translate-y-1/2 font-moon text-[clamp(13px,2.4vh,24px)] leading-none text-cream"
            style={{ top: `${((index + 0.5) / SERIES.length) * 100}%` }}
          >
            {series.short}
          </span>
        ))}
        {hover !== null && (
          <div
            className="pointer-events-none absolute top-2 z-10 w-56 rounded-xl border-2 border-flame bg-cream p-3 font-moon text-sm text-coal-deep shadow-lg"
            style={{ left: `clamp(0px, calc(${((hover * step) / W) * 100}% - 7rem), calc(100% - 14rem))` }}
          >
            <p className="mb-1 text-base text-flame">{nama(bulanan[hover].bulan)} {bulanan[hover].bulan.slice(0, 4)}</p>
            {[...SERIES].reverse().map((series) => (
              <p key={series.key} className="flex justify-between gap-3">
                <span>
                  {series.label}
                </span>
                <span>{series.format(bulanan[hover][series.key])}</span>
              </p>
            ))}
          </div>
        )}
      </div>
      <div className="mt-1 flex justify-between pr-[15%] font-moon text-[clamp(14px,2.4vh,26px)] text-flame">
        {bulanan.map((row) => (
          <span key={row.bulan}>{nama(row.bulan)}</span>
        ))}
      </div>
      {/* Tabel untuk pembaca layar; dibungkus div karena tabel tetap melebar walau diberi sr-only. */}
      <div className="sr-only">
      <table>
        <thead>
          <tr>
            <th>Bulan</th>
            {SERIES.map((series) => (
              <th key={series.key}>{series.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bulanan.map((row) => (
            <tr key={row.bulan}>
              <td>{row.bulan}</td>
              {SERIES.map((series) => (
                <td key={series.key}>{series.format(row[series.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </figure>
  );
}
