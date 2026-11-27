import { motion } from 'motion/react';
import { BookRecord } from '../utils/catalog';

interface BookCardListProps {
  books: BookRecord[];
  columns?: 2 | 3;
}

export function BookCardList({ books, columns = 2 }: BookCardListProps) {
  return (
    <div
      className={
        columns === 3
          ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid grid-cols-1 gap-3 sm:grid-cols-2'
      }
    >
      {books.map((book, index) => (
        <motion.article
          key={book.driveId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.18,
            delay: Math.min(index, 10) * 0.014,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 sm:rounded-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
        >
          <div>
            {/* Balanced unboxed metadata header */}
            <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                  #{book.no}
                </span>
                <span aria-hidden="true">·</span>
                <span>{book.jenjang}</span>
                <span aria-hidden="true">·</span>
                <span>Seri {book.seri}</span>
              </div>
              <span className="font-mono font-semibold text-blue-700 whitespace-nowrap shrink-0 dark:text-blue-400">
                {book.kodeBuku}
              </span>
            </div>

            {/* School Name */}
            <h3 className="mt-2 font-display text-[15px] font-bold leading-snug text-slate-900 sm:text-base dark:text-slate-100">
              {book.namaSekolah}
            </h3>

            {/* Book Title */}
            <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
              {book.judulBuku}
            </p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
