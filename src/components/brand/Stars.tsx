// Bintang rating 1-5. Mode baca menampilkan nilai; mode pilih dipakai klien saat mengulas.
const PATH = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z';

export function StarsView({ value, size = 'size-6' }: { value: number; size?: string }) {
  return (
    <span className="inline-flex" role="img" aria-label={`Rating ${value} dari 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" className={size} aria-hidden="true">
          <path d={PATH} fill={n <= value ? '#ff6200' : 'none'} stroke="#ff6200" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

export function StarsInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div role="radiogroup" aria-label="Rating" className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} bintang`}
          onClick={() => onChange(n)}
          className="rounded-md p-0.5 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-flame"
        >
          <svg viewBox="0 0 24 24" className="size-9" aria-hidden="true">
            <path d={PATH} fill={n <= value ? '#ff6200' : 'none'} stroke="#ff6200" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </button>
      ))}
    </div>
  );
}
