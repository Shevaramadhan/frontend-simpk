import { useEffect, useRef, useState } from 'react';
import ikonGoogle from '../../assets/auth/ikon-google.svg';

// Google Identity Services. Tombol resmi Google dirender di atas tampilan desain, karena hanya tombol resmi
// yang boleh membuka jendela pilih akun dan menghasilkan ID token.
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const SCRIPT = 'https://accounts.google.com/gsi/client';

interface GoogleId {
  initialize: (options: { client_id: string; callback: (response: { credential: string }) => void; ux_mode?: string }) => void;
  renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

let loading: Promise<void> | null = null;
function loadScript(): Promise<void> {
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Gagal memuat Google.'));
    document.head.append(script);
  });
  return loading;
}

const LOOK = 'relative flex h-[clamp(40px,6vh,56px)] w-full items-center justify-center gap-4 rounded-[18px] bg-coal px-6 font-magic text-[clamp(15px,2.4vh,20px)] uppercase text-white';

export default function GoogleButton({ onCredential, label = 'Sign in with Google' }: { onCredential: (credential: string) => void; label?: string }) {
  const slot = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!CLIENT_ID || !slot.current) return;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !slot.current || !window.google) return;
        window.google.accounts.id.initialize({ client_id: CLIENT_ID, callback: (response) => onCredential(response.credential) });
        window.google.accounts.id.renderButton(slot.current, { type: 'standard', theme: 'filled_black', size: 'large', shape: 'pill', width: slot.current.offsetWidth });
        setReady(true);
      })
      .catch(() => setNotice('Google tidak dapat dimuat. Periksa koneksi internet.'));
    return () => {
      cancelled = true;
    };
  }, [onCredential]);

  if (!CLIENT_ID) {
    return (
      <>
        <button type="button" className={LOOK} onClick={() => setNotice('Masuk dengan Google belum tersedia. Silakan daftar dengan email.')}>
          <img alt="" className="size-[clamp(22px,3.6vh,32px)]" src={ikonGoogle} />
          {label}
        </button>
        {notice && <p className="mt-2 text-center font-moon text-sm text-coal-deep">{notice}</p>}
      </>
    );
  }

  return (
    <>
      <div className={LOOK}>
        <img alt="" className="size-[clamp(22px,3.6vh,32px)]" src={ikonGoogle} />
        {label}
        {/* Tombol resmi Google transparan di atas tampilan desain agar klik diterima Google. */}
        <div ref={slot} className={`absolute inset-0 overflow-hidden rounded-[18px] ${ready ? 'opacity-[0.01]' : 'pointer-events-none opacity-0'}`} />
      </div>
      {notice && <p className="mt-2 text-center font-moon text-sm text-coal-deep">{notice}</p>}
    </>
  );
}
