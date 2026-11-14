// Karya Neo Telemetri pada desain Figma. Dipakai landing page dan beranda klien.
import anniversary from '../assets/landing/proyek-anniversary.webp';
import bakti from '../assets/landing/proyek-bakti.webp';
import pkm from '../assets/landing/proyek-pkm.webp';
import simsapras from '../assets/landing/proyek-simsapras.webp';
import tedx from '../assets/landing/proyek-tedx.webp';
import videoProfil from '../assets/landing/proyek-video-profil.webp';
export type Division = 'MMD' | 'PROGRAMMING' | 'SKJ';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  division: Division;
}

// Isi dan urutan mengikuti desain (kiri ke kanan, atas ke bawah). Pembagian divisi adalah asumsi sementara.
export const PROJECTS: Project[] = [
  { id: 'tedx', title: 'TEDX UNAND', image: tedx, division: 'PROGRAMMING', description: 'Website organisasi global non-profit yang fokus pada pengembangan ide dan inovasi dalam teknologi,design dan entertaiment' },
  { id: 'simsapras', title: 'SIMSAPRAS UNAND', image: simsapras, division: 'PROGRAMMING', description: 'Website sistem informasi peminjaman Sarana dan Prasarana di Universitas Andalas sehingga memudahkan pihak peminjam dalam melakukan peminjaman' },
  { id: 'pkm', title: 'Portal pkm unand', image: pkm, division: 'PROGRAMMING', description: 'Program Kreativitas Mahasiswa (PKM) adalah kompetisi yang diselenggarakan untuk mengembangkan ide dan kreativitas mahasiswa dalam berbagai bidang ilmiah dan teknologi.' },
  { id: 'anniversary', title: '20th anniversarry', image: anniversary, division: 'MMD', description: 'Dokumentasi berupa video yang bertujuan untuk mereka ulang bagaimana awal terbentuknya UKM NEOTELEMETRI hingga tetap berjalan sampai sekarang ini' },
  { id: 'bakti', title: 'BAKTI UNAND 2026', image: bakti, division: 'PROGRAMMING', description: 'Website yang betugas sebagai pintu utama mahasiswa-mahasiswa baru UNAND mulai dari maskot,tugas hingga merch official dari BAKTI UNAND' },
  { id: 'video-profil', title: 'VIDEO PROFIL UKM', image: videoProfil, division: 'MMD', description: 'Berisi pengenalan terkait apa itu NEO TELEMETRI,apa saja yang dilakukan di NEO TELEMETRI, serta apa saja divisi yang ada di NEO TELEMETRI' },
];

