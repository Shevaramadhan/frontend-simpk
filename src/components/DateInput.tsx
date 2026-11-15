import type { InputHTMLAttributes, MouseEvent } from 'react';

/** Tanggal hari ini (zona waktu pengguna) dalam format YYYY-MM-DD, untuk batas `min` atau `max`. */
export function hariIni() {
  const d = new Date();
  const dua = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${dua(d.getMonth() + 1)}-${dua(d.getDate())}`;
}

/**
 * Kolom tanggal dengan kalender bawaan peramban. Klik di bagian mana pun kolom membuka kalender,
 * tidak hanya pada ikonnya. Ikon kalender oranye diatur di index.css.
 */
export default function DateInput({ onClick, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  function bukaKalender(event: MouseEvent<HTMLInputElement>) {
    onClick?.(event);
    if (event.defaultPrevented || props.disabled || props.readOnly) return;
    try {
      event.currentTarget.showPicker();
    } catch {
      // Peramban lama tanpa showPicker: pengguna tetap dapat memakai ikon atau mengetik tanggal.
    }
  }
  return <input type="date" onClick={bukaKalender} {...props} />;
}
