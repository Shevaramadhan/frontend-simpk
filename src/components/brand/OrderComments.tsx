import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useCurrentUser } from '../../hooks/useAuth';
import { errorMessage } from '../../services/apiConfig';
import { createOrderComment, listOrderComments } from '../../services/orderService';
import type { OrderComment, Role } from '../../types';
import { tanggalJam } from '../../utils/format';
import { BrandError, brandInputSolid } from './Brand';
import Pagination, { usePagination } from './Pagination';

const PERAN_LABEL: Record<Role, string> = {
  KLIEN: 'Klien',
  MARKETING: 'Marketing',
  OPERASIONAL: 'Operasional',
  TIM: 'Tim',
};

const PERAN_BADGE: Record<Role, string> = {
  KLIEN: 'bg-flame text-coal',
  MARKETING: 'bg-[#ffd27a] text-coal-deep',
  OPERASIONAL: 'bg-[#8fd694] text-coal-deep',
  TIM: 'bg-coal text-cream',
};

const PER_PAGE = 4;

interface OrderCommentsProps {
  orderId: number;
  canSend?: boolean;
}

/** Ruang komentar/chat antara Klien pemilik, Marketing, Operasional, dan tim pelaksana proyek. */
export default function OrderComments({ orderId, canSend = true }: OrderCommentsProps) {
  const user = useCurrentUser();
  const [comments, setComments] = useState<OrderComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [pesan, setPesan] = useState('');
  const [sendError, setSendError] = useState('');
  const [sending, setSending] = useState(false);
  const prevCount = useRef(0);
  const { paged, page, totalPages, setPage } = usePagination(comments, PER_PAGE, true);

  const fetchComments = useCallback(
    async (initial = false) => {
      if (initial) setLoading(true);
      try {
        const items = await listOrderComments(orderId);
        setComments(items);
        setLoadError('');
      } catch (err) {
        if (initial) setLoadError(errorMessage(err));
      } finally {
        if (initial) setLoading(false);
      }
    },
    [orderId],
  );

  useEffect(() => {
    prevCount.current = 0;
    void fetchComments(true);
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void fetchComments(false);
    }, 15_000);
    return () => window.clearInterval(timer);
  }, [fetchComments]);

  // Saat ada komentar baru masuk, arahkan ke halaman terakhir agar pesan terbaru langsung terlihat.
  useEffect(() => {
    if (comments.length > prevCount.current) {
      setPage(Math.max(1, Math.ceil(comments.length / PER_PAGE)));
    }
    prevCount.current = comments.length;
  }, [comments.length, setPage]);

  async function submitComment() {
    const trimmed = pesan.trim();
    if (!trimmed || sending || !canSend) return;
    setSendError('');
    setSending(true);
    try {
      const created = await createOrderComment(orderId, trimmed);
      setComments((current) => [...current, created]);
      setPesan('');
    } catch (err) {
      setSendError(errorMessage(err));
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitComment();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submitComment();
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-magic text-2xl uppercase text-flame sm:text-3xl">Diskusi &amp; Komentar</p>
          <p className="font-moon text-sm text-coal-deep/70">Ruang komunikasi antara klien, Marketing, Operasional, dan tim project.</p>
        </div>
        <button
          type="button"
          onClick={() => void fetchComments(false)}
          className="rounded-xl border-2 border-coal/25 bg-white px-3 py-1 font-moon text-sm text-coal-deep transition-colors hover:border-flame hover:text-flame"
        >
          Muat Ulang
        </button>
      </div>

      <div className="mt-3 space-y-3 rounded-[22px] border-[3px] border-coal/15 bg-white/80 p-4">
        {loading ? (
          <p className="py-6 text-center font-moon text-base text-coal-deep/70">Memuat komentar...</p>
        ) : loadError ? (
          <p role="alert" className="py-4 text-center font-moon text-base text-[#9c2b2b]">
            {loadError}
          </p>
        ) : comments.length === 0 ? (
          <p className="py-6 text-center font-moon text-base text-coal-deep/65">
            Belum ada komentar. Sampaikan pertanyaan, masukan, atau pembaruan seputar project di sini.
          </p>
        ) : (
          paged.map((comment) => {
            const mine = comment.author.id === user.id;
            return (
              <div key={comment.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <article
                  className={`max-w-[85%] rounded-[18px] px-4 py-2.5 sm:max-w-[75%] ${
                    mine ? 'bg-coal text-cream' : 'border-2 border-coal/15 bg-cream text-coal-deep'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-moon text-sm font-bold ${mine ? 'text-flame' : 'text-coal-deep'}`}>
                      {mine ? `${comment.author.name} (Anda)` : comment.author.name}
                    </span>
                    <span className={`rounded-lg px-2 py-0.5 font-moon text-xs ${PERAN_BADGE[comment.author.role]}`}>
                      {PERAN_LABEL[comment.author.role]}
                    </span>
                    <span className={`font-moon text-xs ${mine ? 'text-cream/65' : 'text-coal-deep/60'}`}>{tanggalJam(comment.createdAt)}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words font-moon text-base leading-snug">{comment.pesan}</p>
                </article>
              </div>
            );
          })
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} tone="light" className="mt-3" />

      {canSend ? (
        <form onSubmit={handleSubmit} className="mt-3">
          <label htmlFor={`komentar-order-${orderId}`} className="sr-only">
            Tulis komentar atau pesan
          </label>
          <BrandError message={sendError} />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <textarea
              id={`komentar-order-${orderId}`}
              rows={2}
              maxLength={2000}
              required
              disabled={sending}
              value={pesan}
              onChange={(event) => setPesan(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tulis komentar atau pertanyaan... (Enter untuk kirim, Shift+Enter untuk baris baru)"
              className={`${brandInputSolid} mt-0 flex-1 resize-y bg-white`}
            />
            <button
              type="submit"
              disabled={sending || !pesan.trim()}
              className="shrink-0 rounded-2xl bg-coal px-6 py-2.5 font-magic text-lg uppercase text-flame transition-colors hover:text-cream disabled:opacity-50"
            >
              {sending ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
          <p className="mt-1 font-moon text-xs text-coal-deep/65">Komentar ini terlihat oleh klien, Marketing, Operasional, dan tim project.</p>
        </form>
      ) : (
        <p className="mt-3 rounded-xl bg-coal/10 px-4 py-2 text-center font-moon text-sm text-coal-deep/75">
          Pengajuan atau project ini sudah ditutup. Komentar baru dinonaktifkan.
        </p>
      )}
    </div>
  );
}
