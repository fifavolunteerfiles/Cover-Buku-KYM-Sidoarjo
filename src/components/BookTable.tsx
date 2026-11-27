import { ArrowUpDown } from 'lucide-react';
import { motion } from 'motion/react';
import { BookRecord, SortOption } from '../utils/catalog';
import { triggerHaptic } from '../utils/haptics';

interface BookTableProps {
  books: BookRecord[];
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function BookTable({ books, sortBy, onSortChange }: BookTableProps) {
  const toggleCodeSort = () => {
    triggerHaptic('light');
    onSortChange(sortBy === 'code-asc' ? 'code-desc' : 'code-asc');
  };

  const toggleSchoolSort = () => {
    triggerHaptic('light');
    onSortChange(sortBy === 'school-asc' ? 'school-desc' : 'school-asc');
  };

  const toggleTitleSort = () => {
    triggerHaptic('light');
    onSortChange(sortBy === 'title-asc' ? 'default' : 'title-asc');
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
              <th scope="col" className="w-16 px-4 py-3 text-right tabular-nums">
                No.
              </th>
              <th scope="col" className="w-36 px-4 py-3">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={toggleCodeSort}
                  className="inline-flex items-center gap-1 hover:text-slate-900 cursor-pointer dark:hover:text-white"
                >
                  <span>Kode Buku</span>
                  <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                </motion.button>
              </th>
              <th scope="col" className="px-4 py-3">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={toggleSchoolSort}
                  className="inline-flex items-center gap-1 hover:text-slate-900 cursor-pointer dark:hover:text-white"
                >
                  <span>Nama Sekolah</span>
                  <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                </motion.button>
              </th>
              <th scope="col" className="px-4 py-3">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={toggleTitleSort}
                  className="inline-flex items-center gap-1 hover:text-slate-900 cursor-pointer dark:hover:text-white"
                >
                  <span>Judul Buku</span>
                  <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                </motion.button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {books.map((book, index) => (
              <motion.tr
                key={book.driveId}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.16,
                  delay: Math.min(index, 12) * 0.009,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="transition-colors hover:bg-slate-50/90 dark:hover:bg-slate-800/50"
              >
                <td className="px-4 py-3 text-right font-mono text-xs font-medium text-slate-500 tabular-nums dark:text-slate-400">
                  {book.no}
                </td>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-700 tabular-nums whitespace-nowrap dark:text-blue-400">
                  {book.kodeBuku}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900 dark:text-slate-100">{book.namaSekolah}</div>
                  <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {book.jenjang} <span aria-hidden="true">·</span> Seri {book.seri}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                  {book.judulBuku}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
