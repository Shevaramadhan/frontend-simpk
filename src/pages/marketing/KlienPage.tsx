import { useState } from 'react';
import { BrandError } from '../../components/brand/Brand';
import { BrandTable, LoadError, Loading, StaffPanel, linkButton, tableCell as cell } from '../../components/brand/StaffParts';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { listClients, setClientActive } from '../../services/clientService';
import type { Client } from '../../types';

// Data klien untuk Marketing. Menu tambahan di luar desain Figma, bergaya halaman pengurus.
function waLink(nomor: string) {
  const digits = nomor.replace(/\D/g, '');
  return `https://wa.me/${digits.startsWith('0') ? `62${digits.slice(1)}` : digits}`;
}

export default function KlienPage() {
  const { data, loading, error, reload } = useData(listClients);
  const [actionError, setActionError] = useState('');

  async function toggle(client: Client) {
    setActionError('');
    try {
      await setClientActive(client.id, !client.isActive);
      await reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  }

  return (
    <StaffPanel title="Klien">
      <p className="mb-3 font-moon text-base text-cream/80">Klien mendaftar sendiri lewat halaman Sign In. Nonaktifkan akun yang tidak jelas atau spam.</p>
      <BrandError message={actionError} />
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <LoadError message={error} />
      ) : (
        <BrandTable head={['Instansi', 'Kontak', 'Email', 'WhatsApp', 'Status']} empty={data?.length ? undefined : 'Belum ada klien.'}>
          {(data ?? []).map((client) => (
            <tr key={client.id} className={client.isActive ? '' : 'opacity-60'}>
              <td className={cell}>
                {client.namaInstansi}
                <span className="block text-xs text-coal-deep/60">{client.jenisKlien}</span>
              </td>
              <td className={cell}>{client.user.name}</td>
              <td className={cell}>{client.user.email}</td>
              <td className={cell}>
                {client.noWhatsapp ? (
                  <a href={waLink(client.noWhatsapp)} target="_blank" rel="noreferrer" className={linkButton}>
                    {client.noWhatsapp}
                  </a>
                ) : (
                  <span className="text-coal-deep/50">Belum diisi</span>
                )}
              </td>
              <td className={cell}>
                <span className={client.isActive ? 'text-[#14aa00]' : 'text-[#e60000]'}>{client.isActive ? 'Aktif' : 'Nonaktif'}</span>
                <button type="button" className={`${linkButton} ml-3`} onClick={() => void toggle(client)}>
                  {client.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
              </td>
            </tr>
          ))}
        </BrandTable>
      )}
    </StaffPanel>
  );
}
