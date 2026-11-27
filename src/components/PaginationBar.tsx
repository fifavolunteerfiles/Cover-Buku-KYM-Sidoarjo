import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { triggerHaptic } from '../utils/haptics';

export type PageSizeOption = 25 | 50 | 100 | 'all';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  pageSize: PageSizeOption;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: PageSizeOption) => void;
}

export function PaginationBar({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
}: PaginationBarProps) {
  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:rounded-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-start">
        <p className="text-xs text-slate-600 tabular-nums sm:text-sm dark:text-slate-400">
          Baris <span className="font-semibold text-slate-900 dark:text-slate-100">{startIndex + 1}</span>–
          <span className="font-semibold text-slate-900 dark:text-slate-100">{endIndex}</span> dari{' '}
          <span className="font-semibold text-slate-900 dark:text-slate-100">{totalItems}</span>
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="page-size-select" className="text-xs text-slate-500 dark:text-slate-400">
            Per halaman:
          </label>
          <select
            id="page-size-select"
            value={String(pageSize)}
            onChange={(e) => {
              triggerHaptic('light');
              const v = e.target.value;
              onPageSizeChange(v === 'all' ? 'all' : (Number(v) as 25 | 50 | 100));
            }}
            className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-medium text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="all">Semua ({totalItems})</option>
          </select>
        </div>
      </div>

      {pageSize !== 'all' && totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <motion.button
            type="button"
            whileTap={currentPage > 1 ? { scale: 0.95 } : undefined}
            onClick={() => {
              triggerHaptic('medium');
              onPageChange(currentPage - 1);
            }}
            disabled={currentPage <= 1}
            aria-label="Halaman sebelumnya"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span>Sebelumnya</span>
          </motion.button>

          <motion.span
            key={`${currentPage}-${totalPages}`}
            initial={{ scale: 0.94, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1, x: [0, -1.5, 1.5, 0] }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="px-2 font-mono text-xs font-medium text-slate-700 tabular-nums dark:text-slate-300"
          >
            {currentPage} / {totalPages}
          </motion.span>

          <motion.button
            type="button"
            whileTap={currentPage < totalPages ? { scale: 0.95 } : undefined}
            onClick={() => {
              triggerHaptic('medium');
              onPageChange(currentPage + 1);
            }}
            disabled={currentPage >= totalPages}
            aria-label="Halaman berikutnya"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <span>Berikutnya</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </motion.button>
        </div>
      )}
    </div>
  );
}
