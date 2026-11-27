import { LayoutGrid, RotateCcw, Search, Table2, X } from 'lucide-react';
import { motion } from 'motion/react';
import {
  BookSeries,
  CatalogStats,
  SchoolLevel,
  SortOption,
  TITLE_SATU_BAIT,
  TITLE_SIMFONI,
} from '../utils/catalog';
import { triggerHaptic } from '../utils/haptics';

export type ViewMode = 'table' | 'grid';

interface FilterToolbarProps {
  query: string;
  onQueryChange: (val: string) => void;
  jenjang: 'all' | SchoolLevel;
  onJenjangChange: (val: 'all' | SchoolLevel) => void;
  judul: string;
  onJudulChange: (val: string) => void;
  seri: 'all' | BookSeries;
  onSeriChange: (val: 'all' | BookSeries) => void;
  sortBy: SortOption;
  onSortChange: (val: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (val: ViewMode) => void;
  filteredCount: number;
  totalCount: number;
  stats: CatalogStats;
  onResetFilters: () => void;
}

const JENJANG_OPTIONS: Array<{ value: 'all' | SchoolLevel; label: string }> = [
  { value: 'all', label: 'Semua' },
  { value: 'SD', label: 'SD' },
  { value: 'SMP', label: 'SMP' },
  { value: 'SMA', label: 'SMA' },
  { value: 'SMK', label: 'SMK' },
  { value: 'SLB', label: 'SLB' },
];

export function FilterToolbar({
  query,
  onQueryChange,
  jenjang,
  onJenjangChange,
  judul,
  onJudulChange,
  seri,
  onSeriChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  filteredCount,
  totalCount,
  stats,
  onResetFilters,
}: FilterToolbarProps) {
  const hasActiveFilters =
    query.trim().length > 0 || jenjang !== 'all' || judul !== 'all' || seri !== 'all' || sortBy !== 'default';

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:rounded-xl sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      {/* Row 1: Search */}
      <div className="relative">
        <label htmlFor="catalog-search" className="sr-only">
          Cari nomor, nama sekolah, judul buku, atau kode buku
        </label>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          aria-hidden="true"
        />
        <input
          id="catalog-search"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Cari nama sekolah, kode buku (misal SI-A12), atau judul..."
          className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-800"
        />
        {query.length > 0 && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              triggerHaptic('light');
              onQueryChange('');
            }}
            aria-label="Hapus pencarian"
            className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </motion.button>
        )}
      </div>

      {/* Row 2: Jenjang segmented filter + View Switcher */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Filter jenjang sekolah"
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
                  onJenjangChange(opt.value);
                }}
                aria-pressed={isActive}
                className={`inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer sm:text-sm ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <span>{opt.label}</span>
                <span className="font-mono text-[11px] text-slate-400 tabular-nums dark:text-slate-400">
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Desktop View Mode Toggle (Table vs Card Grid) */}
        <div
          role="group"
          aria-label="Mode tampilan desktop"
          className="hidden items-center gap-1 self-start rounded-lg bg-slate-100 p-1 shrink-0 md:inline-flex lg:self-auto dark:bg-slate-800"
        >
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              triggerHaptic('light');
              onViewModeChange('table');
            }}
            aria-pressed={viewMode === 'table'}
            aria-label="Tampilan tabel"
            className={`inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer sm:text-sm ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Table2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Tabel</span>
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              triggerHaptic('light');
              onViewModeChange('grid');
            }}
            aria-pressed={viewMode === 'grid'}
            aria-label="Tampilan kartu"
            className={`inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer sm:text-sm ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Kartu</span>
          </motion.button>
        </div>
      </div>

      {/* Row 3: Select Filters */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div>
          <label htmlFor="filter-judul" className="sr-only">
            Filter Judul Buku
          </label>
          <select
            id="filter-judul"
            value={judul}
            onChange={(e) => {
              triggerHaptic('light');
              onJudulChange(e.target.value);
            }}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-blue-500"
          >
            <option value="all">Semua Judul Buku</option>
            <option value={TITLE_SIMFONI}>Simfoni Sunyi ({stats.simfoniCount})</option>
            <option value={TITLE_SATU_BAIT}>Satu Bait, Satu Cahaya ({stats.satuBaitCount})</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter-seri" className="sr-only">
            Filter Seri Jilid
          </label>
          <select
            id="filter-seri"
            value={seri}
            onChange={(e) => {
              triggerHaptic('light');
              onSeriChange(e.target.value as 'all' | BookSeries);
            }}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-blue-500"
          >
            <option value="all">Semua Seri (A–F)</option>
            <option value="A">Seri SI-A ({stats.seriesCounts.A})</option>
            <option value="B">Seri SI-B ({stats.seriesCounts.B})</option>
            <option value="C">Seri SI-C ({stats.seriesCounts.C})</option>
            <option value="D">Seri SI-D ({stats.seriesCounts.D})</option>
            <option value="E">Seri SI-E ({stats.seriesCounts.E})</option>
            <option value="F">Seri SI-F ({stats.seriesCounts.F})</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort-select" className="sr-only">
            Urutkan Data
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => {
              triggerHaptic('light');
              onSortChange(e.target.value as SortOption);
            }}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-blue-500"
          >
            <option value="default">Urut: Nomor Asli (1–382)</option>
            <option value="code-asc">Urut: Kode Buku (A–F)</option>
            <option value="code-desc">Urut: Kode Buku (F–A)</option>
            <option value="school-asc">Urut: Sekolah (A–Z)</option>
            <option value="school-desc">Urut: Sekolah (Z–A)</option>
            <option value="title-asc">Urut: Judul Buku</option>
          </select>
        </div>
      </div>

      {/* Row 4: Active result status & reset */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <motion.p
          key={filteredCount}
          initial={{ opacity: 0.7, x: -2 }}
          animate={{ opacity: 1, x: [0, -1.5, 1.5, 0] }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="tabular-nums"
        >
          Menampilkan <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredCount}</span> dari{' '}
          <span className="font-semibold text-slate-900 dark:text-slate-100">{totalCount}</span> buku
        </motion.p>
        {hasActiveFilters && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              triggerHaptic('reset');
              onResetFilters();
            }}
            className="inline-flex items-center gap-1 font-medium text-blue-700 hover:text-blue-800 hover:underline underline-offset-4 cursor-pointer dark:text-blue-400 dark:hover:text-blue-300"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset Filter</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
