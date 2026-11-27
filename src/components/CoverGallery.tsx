import { useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, RotateCcw, Search, SearchX, X } from 'lucide-react';
import { motion } from 'motion/react';
import {
  BookRecord,
  CatalogStats,
  SchoolLevel,
  TITLE_SATU_BAIT,
  TITLE_SIMFONI,
  filterAndSortCatalog,
} from '../utils/catalog';
import { triggerHaptic } from '../utils/haptics';

interface CoverGalleryProps {
  books: BookRecord[];
  stats: CatalogStats;
}

const JENJANG_OPTIONS: Array<{ value: 'all' | SchoolLevel; label: string }> = [
  { value: 'all', label: 'Semua' },
  { value: 'SD', label: 'SD' },
  { value: 'SMP', label: 'SMP' },
  { value: 'SMA', label: 'SMA' },
  { value: 'SMK', label: 'SMK' },
  { value: 'SLB', label: 'SLB' },
];

function GalleryCoverImage({ book }: { book: BookRecord }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex aspect-[10/7] w-full flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-100 px-2 text-center dark:border-slate-800 dark:bg-slate-800">
        <BookOpen className="h-5 w-5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
        <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300">
          {book.kodeBuku}
        </span>
      </div>
    );
  }

  return (
    <div className="relative aspect-[10/7] w-full overflow-hidden rounded-xl border border-slate-200/90 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-slate-200/70 dark:bg-slate-700/50" />
      )}
      <img
        src={book.localCoverUrl}
        alt={`Sampul buku ${book.kodeBuku} - ${book.namaSekolah}`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover transition-all duration-300 group-hover:scale-[1.03] ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

export function CoverGallery({ books, stats }: CoverGalleryProps) {
  const [query, setQuery] = useState('');
  const [jenjang, setJenjang] = useState<'all' | SchoolLevel>('all');
  const [judul, setJudul] = useState<string>('all');
  const [selectedBook, setSelectedBook] = useState<BookRecord | null>(null);

  const galleryBooks = useMemo(
    () =>
      filterAndSortCatalog(books, {
        query,
        jenjang,
        judul,
        sortBy: 'default',
      }),
    [books, query, jenjang, judul]
  );

  const selectedIndex = selectedBook
    ? galleryBooks.findIndex((b) => b.driveId === selectedBook.driveId)
    : -1;
  const hasPrev = selectedIndex > 0;
  const hasNext = selectedIndex >= 0 && selectedIndex < galleryBooks.length - 1;

  useEffect(() => {
    if (!selectedBook) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedBook(null);
      if (e.key === 'ArrowLeft' && hasPrev) {
        triggerHaptic('light');
        setSelectedBook(galleryBooks[selectedIndex - 1]);
      }
      if (e.key === 'ArrowRight' && hasNext) {
        triggerHaptic('light');
        setSelectedBook(galleryBooks[selectedIndex + 1]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedBook, hasPrev, hasNext, galleryBooks, selectedIndex]);

  const hasFilters = query.trim().length > 0 || jenjang !== 'all' || judul !== 'all';

  const resetFilters = () => {
    triggerHaptic('reset');
    setQuery('');
    setJenjang('all');
    setJudul('all');
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Gallery Header */}
      <section className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div className="flex max-w-2xl flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <img
            src="/assets/aistudio/IMG_8414_ecf9e34e.JPG"
            alt="Logo Komunitas Yuk Menulis Sidoarjo"
            className="h-14 w-14 shrink-0 rounded-full border border-slate-200 bg-white object-contain p-0.5 shadow-xs sm:h-14 sm:w-14 dark:border-slate-700"
          />
          <div>
            <h1 className="font-display text-[22px] leading-tight font-bold tracking-tight text-slate-900 text-balance sm:text-3xl dark:text-slate-100">
              Galeri Katalog Sampul Buku
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
              Seluruh {books.length} desain sampul buku antologi puisi beserta nama sekolah Kabupaten Sidoarjo.
            </p>
          </div>
        </div>
        <div className="shrink-0 font-mono text-xs font-medium text-slate-500 tabular-nums sm:text-right dark:text-slate-400">
          {galleryBooks.length} / {books.length} Sampul
        </div>
      </section>

      {/* Gallery Filter Bar */}
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 sm:rounded-xl sm:p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <label htmlFor="gallery-search" className="sr-only">
              Cari sampul buku berdasarkan nama sekolah, kode buku, atau judul
            </label>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              aria-hidden="true"
            />
            <input
              id="gallery-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama sekolah atau kode sampul (misal SI-A12)..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-800"
            />
            {query.length > 0 && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  triggerHaptic('light');
                  setQuery('');
                }}
                aria-label="Hapus pencarian galeri"
                className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer dark:hover:bg-slate-700 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </motion.button>
            )}
          </div>

          <div className="sm:w-64">
            <label htmlFor="gallery-judul-select" className="sr-only">
              Filter Judul Buku di Galeri
            </label>
            <select
              id="gallery-judul-select"
              value={judul}
              onChange={(e) => {
                triggerHaptic('light');
                setJudul(e.target.value);
              }}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">Semua Judul ({stats.totalBooks})</option>
              <option value={TITLE_SIMFONI}>Simfoni Sunyi ({stats.simfoniCount})</option>
              <option value={TITLE_SATU_BAIT}>Satu Bait, Satu Cahaya ({stats.satuBaitCount})</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="group"
            aria-label="Filter jenjang galeri"
            className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1 sm:inline-flex sm:flex-wrap sm:items-center dark:bg-slate-800"
          >
            {JENJANG_OPTIONS.map((opt) => {
              const count = opt.value === 'all' ? stats.totalBooks : stats.jenjangCounts[opt.value];
              const isActive = jenjang === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    triggerHaptic('light');
                    setJenjang(opt.value);
                  }}
                  aria-pressed={isActive}
                  className={`inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer sm:text-sm ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className="font-mono text-[11px] text-slate-400 tabular-nums">{count}</span>
                </motion.button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <motion.span
              key={galleryBooks.length}
              initial={{ opacity: 0.7, x: -2 }}
              animate={{ opacity: 1, x: [0, -1.5, 1.5, 0] }}
              transition={{ duration: 0.18 }}
              className="tabular-nums"
            >
              Menampilkan <strong className="font-semibold text-slate-900 dark:text-slate-100">{galleryBooks.length}</strong> sampul
            </motion.span>
            {hasFilters && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className="inline-flex items-center gap-1 font-medium text-blue-700 hover:underline underline-offset-4 cursor-pointer dark:text-blue-400"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reset</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Dense Responsive Cover Gallery Grid */}
      {galleryBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center sm:rounded-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <SearchX className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-display text-base font-bold text-slate-900 dark:text-slate-100">
            Sampul tidak ditemukan
          </h2>
          <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">
            Tidak ada sampul buku yang sesuai dengan kata kunci atau filter yang dipilih.
          </p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={resetFilters}
            className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
          >
            Tampilkan Semua Sampul
          </motion.button>
        </div>
      ) : (
        <motion.div
          key={`${jenjang}-${judul}-${query.trim().toLowerCase()}`}
          data-testid="cover-gallery-grid"
          initial={{ opacity: 0.3, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5"
        >
          {galleryBooks.map((book) => (
            <motion.button
              key={book.driveId}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                triggerHaptic('light');
                setSelectedBook(book);
              }}
              aria-label={`Lihat detail sampul ${book.kodeBuku} ${book.namaSekolah}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-2 text-left transition-colors hover:border-blue-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:rounded-xl sm:p-2.5 cursor-pointer dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/60"
            >
              <GalleryCoverImage book={book} />

              <div className="mt-2.5 flex flex-1 flex-col justify-between px-0.5 pb-0.5">
                <div>
                  <div className="flex items-center justify-between gap-1 text-[11px] tabular-nums">
                    <span className="font-mono font-semibold text-slate-500 dark:text-slate-400">
                      #{book.no}
                    </span>
                    <span className="font-mono font-semibold text-blue-700 whitespace-nowrap dark:text-blue-400">
                      {book.kodeBuku}
                    </span>
                  </div>
                  <h2 className="mt-1 font-display text-xs font-bold leading-snug text-slate-900 sm:text-[13px] dark:text-slate-100">
                    {book.namaSekolah}
                  </h2>
                </div>
                <p className="mt-1 text-[11px] leading-snug text-slate-500 line-clamp-1 dark:text-slate-400">
                  {book.judulBuku}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Local Cover Preview Lightbox (Zero Google Drive Access) */}
      {selectedBook && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-lightbox-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 backdrop-blur-xs sm:items-center sm:p-4"
          onClick={() => setSelectedBook(null)}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-xl sm:max-w-3xl sm:rounded-2xl dark:border-slate-800 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-2.5 sm:hidden" aria-hidden="true">
              <div className="h-1 w-10 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>

            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-3.5 sm:px-6 dark:border-slate-800">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-500 tabular-nums dark:text-slate-400">
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                    #{selectedBook.no}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono font-semibold text-blue-700 dark:text-blue-400">
                    {selectedBook.kodeBuku}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedBook.jenjang}</span>
                  <span aria-hidden="true">·</span>
                  <span>Seri {selectedBook.seri}</span>
                </div>
                <h2
                  id="gallery-lightbox-title"
                  className="mt-1 font-display text-base font-bold text-slate-900 sm:text-lg dark:text-slate-100"
                >
                  {selectedBook.namaSekolah}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                aria-label="Tutup pratinjau sampul"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
                <img
                  src={selectedBook.localCoverUrl}
                  alt={`Pratinjau sampul ${selectedBook.kodeBuku} - ${selectedBook.namaSekolah}`}
                  referrerPolicy="no-referrer"
                  className="aspect-[10/7] w-full object-contain"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-800/60">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Judul Buku</p>
                <p className="mt-0.5 font-semibold text-slate-900 dark:text-slate-100">
                  {selectedBook.judulBuku}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-slate-200 bg-white px-4 py-3 sm:px-6 dark:border-slate-800 dark:bg-slate-900">
              <motion.button
                type="button"
                whileTap={hasPrev ? { scale: 0.95 } : undefined}
                onClick={() => {
                  if (hasPrev) {
                    triggerHaptic('medium');
                    setSelectedBook(galleryBooks[selectedIndex - 1]);
                  }
                }}
                disabled={!hasPrev}
                className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                <span>Sebelumnya</span>
              </motion.button>

              <span className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                {selectedIndex + 1} / {galleryBooks.length}
              </span>

              <motion.button
                type="button"
                whileTap={hasNext ? { scale: 0.95 } : undefined}
                onClick={() => {
                  if (hasNext) {
                    triggerHaptic('medium');
                    setSelectedBook(galleryBooks[selectedIndex + 1]);
                  }
                }}
                disabled={!hasNext}
                className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <span>Berikutnya</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
