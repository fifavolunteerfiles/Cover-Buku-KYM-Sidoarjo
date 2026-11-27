import { motion } from 'motion/react';
import { CatalogStats, TITLE_SATU_BAIT, TITLE_SIMFONI } from '../utils/catalog';
import { triggerHaptic } from '../utils/haptics';

interface SummaryStripProps {
  stats: CatalogStats;
  activeJudul: string;
  onSelectJudul: (judul: string) => void;
}

export function SummaryStrip({ stats, activeJudul, onSelectJudul }: SummaryStripProps) {
  const isSimfoniActive = activeJudul === TITLE_SIMFONI;
  const isSatuBaitActive = activeJudul === TITLE_SATU_BAIT;

  return (
    <section
      id="ringkasan"
      aria-label="Ringkasan katalog"
      className="scroll-mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 md:scroll-mt-20"
    >
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3.5 sm:rounded-xl sm:p-5 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-[11px] font-medium leading-snug text-slate-500 sm:text-xs dark:text-slate-400">
          Total Buku Terdata
        </p>
        <div className="mt-2">
          <p className="font-mono text-2xl font-semibold tracking-tight text-slate-900 tabular-nums sm:text-3xl dark:text-slate-100">
            {stats.totalBooks}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 sm:text-xs dark:text-slate-400">
            Seri SI-A s.d. SI-F
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3.5 sm:rounded-xl sm:p-5 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-[11px] font-medium leading-snug text-slate-500 sm:text-xs dark:text-slate-400">
          Sekolah Terdaftar
        </p>
        <div className="mt-2">
          <p className="font-mono text-2xl font-semibold tracking-tight text-slate-900 tabular-nums sm:text-3xl dark:text-slate-100">
            {stats.uniqueSchools}
          </p>
          <p className="mt-1 text-[11px] leading-snug text-slate-500 sm:text-xs dark:text-slate-400">
            SD, SMP, SMA, SMK, SLB
          </p>
        </div>
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          triggerHaptic('select');
          onSelectJudul(isSimfoniActive ? 'all' : TITLE_SIMFONI);
        }}
        aria-pressed={isSimfoniActive}
        className={`group flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:rounded-xl sm:p-5 cursor-pointer ${
          isSimfoniActive
            ? 'border-blue-600 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-950/40'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800/70'
        }`}
      >
        <p className="text-[11px] font-medium leading-snug text-slate-500 sm:text-xs dark:text-slate-400">
          {TITLE_SIMFONI}
        </p>
        <div className="mt-2">
          <p className="font-mono text-2xl font-semibold tracking-tight text-slate-900 tabular-nums sm:text-3xl dark:text-slate-100">
            {stats.simfoniCount}
          </p>
          <p className="mt-1 text-[11px] font-medium text-blue-700 sm:text-xs dark:text-blue-400">
            {isSimfoniActive ? 'Filter aktif · Reset' : 'Seri A, C, E · Filter'}
          </p>
        </div>
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          triggerHaptic('select');
          onSelectJudul(isSatuBaitActive ? 'all' : TITLE_SATU_BAIT);
        }}
        aria-pressed={isSatuBaitActive}
        className={`group flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:rounded-xl sm:p-5 cursor-pointer ${
          isSatuBaitActive
            ? 'border-blue-600 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-950/40'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800/70'
        }`}
      >
        <p className="text-[11px] font-medium leading-snug text-slate-500 sm:text-xs dark:text-slate-400">
          {TITLE_SATU_BAIT}
        </p>
        <div className="mt-2">
          <p className="font-mono text-2xl font-semibold tracking-tight text-slate-900 tabular-nums sm:text-3xl dark:text-slate-100">
            {stats.satuBaitCount}
          </p>
          <p className="mt-1 text-[11px] font-medium text-blue-700 sm:text-xs dark:text-blue-400">
            {isSatuBaitActive ? 'Filter aktif · Reset' : 'Seri B, D, F · Filter'}
          </p>
        </div>
      </motion.button>
    </section>
  );
}
