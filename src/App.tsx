import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, SearchX } from 'lucide-react';
import { MotionConfig, motion } from 'motion/react';
import { DRIVE_FILES } from './data/driveFiles';
import {
  BookSeries,
  SchoolLevel,
  SortOption,
  buildCatalog,
  computeCatalogStats,
  filterAndSortCatalog,
} from './utils/catalog';
import { triggerHaptic } from './utils/haptics';
import { shouldShowSplash } from './utils/splash';
import { KYM_LOGO_PATH, resolvePublicAsset } from './utils/assets';
import { AppPage, HeaderBar } from './components/HeaderBar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SummaryStrip } from './components/SummaryStrip';
import { FilterToolbar, ViewMode } from './components/FilterToolbar';
import { BookTable } from './components/BookTable';
import { BookCardList } from './components/BookCardList';
import { PageSizeOption, PaginationBar } from './components/PaginationBar';
import { CoverGallery } from './components/CoverGallery';
import { LogoRevealSplash } from './components/LogoRevealSplash';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : true
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
}

const THEME_STORAGE_KEY = 'cover-sidoarjo-theme';

export default function App() {
  const isDesktop = useIsDesktop();
  const allBooks = useMemo(() => buildCatalog(DRIVE_FILES), []);
  const stats = useMemo(() => computeCatalogStats(allBooks), [allBooks]);

  const [showSplash, setShowSplash] = useState<boolean>(() =>
    typeof window !== 'undefined' ? shouldShowSplash(window.location.search) : true
  );
  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  const [activePage, setActivePage] = useState<AppPage>('ringkasan');
  const [searchFocused, setSearchFocused] = useState(false);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, [isDark]);

  const [query, setQuery] = useState('');
  const [jenjang, setJenjang] = useState<'all' | SchoolLevel>('all');
  const [judul, setJudul] = useState<string>('all');
  const [seri, setSeri] = useState<'all' | BookSeries>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [pageSize, setPageSize] = useState<PageSizeOption>(50);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBooks = useMemo(
    () =>
      filterAndSortCatalog(allBooks, {
        query,
        jenjang,
        judul,
        seri,
        sortBy,
      }),
    [allBooks, query, jenjang, judul, seri, sortBy]
  );

  const totalPages = useMemo(() => {
    if (pageSize === 'all') return 1;
    return Math.max(1, Math.ceil(filteredBooks.length / pageSize));
  }, [filteredBooks.length, pageSize]);

  const safePage = Math.min(currentPage, totalPages);

  const paginatedBooks = useMemo(() => {
    if (pageSize === 'all') return filteredBooks;
    const start = (safePage - 1) * pageSize;
    return filteredBooks.slice(start, start + pageSize);
  }, [filteredBooks, pageSize, safePage]);

  const startIndex = pageSize === 'all' ? 0 : (safePage - 1) * pageSize;
  const endIndex = Math.min(filteredBooks.length, startIndex + paginatedBooks.length);

  const handleSelectPage = (page: AppPage) => {
    setActivePage(page);
    setSearchFocused(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setCurrentPage(1);
  };

  const handleJenjangChange = (val: 'all' | SchoolLevel) => {
    setJenjang(val);
    setCurrentPage(1);
  };

  const handleJudulChange = (val: string) => {
    setJudul(val);
    setCurrentPage(1);
  };

  const handleSeriChange = (val: 'all' | BookSeries) => {
    setSeri(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: SortOption) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: PageSizeOption) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const section = document.getElementById('daftar-buku');
    if (section && section.getBoundingClientRect().top < 0) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleResetFilters = () => {
    setQuery('');
    setJenjang('all');
    setJudul('all');
    setSeri('all');
    setSortBy('default');
    setCurrentPage(1);
  };

  const handleFocusSearch = () => {
    setSearchFocused(true);
    const inputId = activePage === 'katalog' ? 'gallery-search' : 'catalog-search';
    const section = activePage === 'ringkasan' ? document.getElementById('daftar-buku') : null;
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setTimeout(() => {
      const input = document.getElementById(inputId) as HTMLInputElement | null;
      input?.focus({ preventScroll: true });
    }, 180);
  };

  const listTransitionKey =
    filteredBooks.length === 0
      ? 'empty'
      : `${safePage}-${pageSize}-${jenjang}-${judul}-${seri}-${sortBy}-${query.trim().toLowerCase()}-${isDesktop ? viewMode : 'mobile'}`;

  return (
    <MotionConfig reducedMotion="user">
      <LogoRevealSplash visible={showSplash} onFinish={handleSplashFinish} />
      <div id="top" className="min-h-screen bg-slate-50 pb-20 text-slate-900 transition-colors md:pb-0 dark:bg-slate-950 dark:text-slate-100">
        <HeaderBar
          activePage={activePage}
          onSelectPage={handleSelectPage}
          isDark={isDark}
          onToggleDark={() => setIsDark((prev) => !prev)}
        />

        <main className="mx-auto max-w-7xl px-4 pt-5 pb-6 sm:px-6 sm:py-8 lg:px-8">
          <motion.div
            key={activePage}
            initial={{ opacity: 0.3, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {activePage === 'katalog' ? (
              <CoverGallery books={allBooks} stats={stats} />
            ) : (
              <div className="space-y-5 sm:space-y-6">
                {/* Intro Header */}
                <section className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                  <div className="flex max-w-2xl flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-4">
                    <img
                      src={resolvePublicAsset(KYM_LOGO_PATH)}
                      alt="Logo Komunitas Yuk Menulis Sidoarjo"
                      className="h-16 w-16 shrink-0 rounded-full border border-slate-200 bg-white object-contain p-0.5 shadow-xs sm:h-16 sm:w-16 dark:border-slate-700"
                    />
                    <div>
                      <h1 className="font-display text-[22px] leading-tight font-bold tracking-tight text-slate-900 text-balance sm:text-3xl dark:text-slate-100">
                        Daftar Buku & Kode Sekolah Kabupaten Sidoarjo
                      </h1>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600 sm:mt-2 sm:text-base dark:text-slate-400">
                        Data lengkap nomor urut, nama sekolah, judul buku antologi puisi, dan kode buku
                        dari seluruh 382 buku terdata.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-xs font-medium text-slate-500 sm:text-right dark:text-slate-400">
                    Kemendikdasmen · Komunitas Yuk Menulis
                  </div>
                </section>

                {/* Summary Strip */}
                <SummaryStrip
                  stats={stats}
                  activeJudul={judul}
                  onSelectJudul={handleJudulChange}
                />

                {/* Catalog Section */}
                <section id="daftar-buku" aria-label="Daftar lengkap buku" className="scroll-mt-4 space-y-4 md:scroll-mt-20">
                  <FilterToolbar
                    query={query}
                    onQueryChange={handleQueryChange}
                    jenjang={jenjang}
                    onJenjangChange={handleJenjangChange}
                    judul={judul}
                    onJudulChange={handleJudulChange}
                    seri={seri}
                    onSeriChange={handleSeriChange}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    filteredCount={filteredBooks.length}
                    totalCount={allBooks.length}
                    stats={stats}
                    onResetFilters={handleResetFilters}
                  />

                  <motion.div
                    key={listTransitionKey}
                    data-testid="catalog-list-container"
                    initial={{ opacity: 0.25, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {filteredBooks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center sm:rounded-xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          <SearchX className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <h2 className="mt-4 font-display text-base font-bold text-slate-900 dark:text-slate-100">
                          Data tidak ditemukan
                        </h2>
                        <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">
                          Tidak ada buku atau sekolah yang cocok dengan kata kunci maupun filter yang dipilih.
                        </p>
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            triggerHaptic('reset');
                            handleResetFilters();
                          }}
                          className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
                        >
                          Reset Semua Filter
                        </motion.button>
                      </div>
                    ) : !isDesktop ? (
                      <BookCardList books={paginatedBooks} columns={2} />
                    ) : viewMode === 'table' ? (
                      <BookTable
                        books={paginatedBooks}
                        sortBy={sortBy}
                        onSortChange={handleSortChange}
                      />
                    ) : (
                      <BookCardList books={paginatedBooks} columns={3} />
                    )}
                  </motion.div>

                  {filteredBooks.length > 0 && (
                    <PaginationBar
                      currentPage={safePage}
                      totalPages={totalPages}
                      pageSize={pageSize}
                      totalItems={filteredBooks.length}
                      startIndex={startIndex}
                      endIndex={endIndex}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                    />
                  )}
                </section>
              </div>
            )}
          </motion.div>
        </main>

        {/* Quiet Editorial Footer */}
        <footer className="mt-8 border-t border-slate-200 bg-white sm:mt-10 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-1.5 px-4 py-6 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left lg:px-8 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
              <span>Katalog Data Sampul Buku · Kabupaten Sidoarjo</span>
            </div>
            <span>Komunitas Yuk Menulis · Sidoarjo</span>
          </div>
        </footer>

        <MobileBottomNav
          activePage={activePage}
          searchFocused={searchFocused}
          onSelectPage={handleSelectPage}
          isDark={isDark}
          onToggleDark={() => setIsDark((prev) => !prev)}
          onFocusSearch={handleFocusSearch}
        />
      </div>
    </MotionConfig>
  );
}
