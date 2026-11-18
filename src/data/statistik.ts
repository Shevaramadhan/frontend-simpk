// Angka Neo Telemetri di hero landing page, sesuai halaman marketing resmi Neo Telemetri (neotelemetri.id).
// Ejaan label dirapikan: "Reability" menjadi "Reliability", "Expertise of years" menjadi "Years of Expertise".
export interface Statistik {
  nilai: number;
  /** Tanda setelah angka, misalnya "+" atau "%". */
  akhiran?: string;
  label: string;
}

export const STATISTIK: Statistik[] = [
  { nilai: 8, akhiran: '+', label: 'Projects Delivered' },
  { nilai: 40, label: 'Tech Visionaries' },
  { nilai: 99, akhiran: '%', label: 'System Reliability' },
  { nilai: 10, akhiran: '+', label: 'Years of Expertise' },
];
