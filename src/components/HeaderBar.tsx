import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { triggerHaptic } from '../utils/haptics';
import { KYM_LOGO_PATH, resolvePublicAsset } from '../utils/assets';

export type AppPage = 'ringkasan' | 'katalog';

interface HeaderBarProps {
  activePage: AppPage;
  onSelectPage: (page: AppPage) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export function HeaderBar({ activePage, onSelectPage, isDark, onToggleDark }: HeaderBarProps) {
  return (
    <header className="sticky top-0 z-30 hidden border-b border-slate-200 bg-white/95 backdrop-blur-md md:block dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6 lg:px-8">
        {/* Zone 1: KYM Logo + Brand Wordmark */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onSelectPage('ringkasan');
          }}
          className="inline-flex items-center gap-2.5 rounded-md font-display text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:text-lg cursor-pointer dark:text-slate-100 dark:focus-visible:ring-offset-slate-900"
        >
          <img
            src={resolvePublicAsset(KYM_LOGO_PATH)}
            alt="Logo KYM Sidoarjo"
            className="h-9 w-9 shrink-0 rounded-full bg-white object-contain p-0.5 ring-1 ring-slate-200 sm:h-10 sm:w-10 dark:ring-slate-700"
          />
          <span>Cover Sidoarjo</span>
        </button>

        {/* Zone 2: Concise single-line page navigation */}
        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-6 text-sm font-medium md:flex"
        >
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onSelectPage('ringkasan');
            }}
            aria-current={activePage === 'ringkasan' ? 'page' : undefined}
            className={`whitespace-nowrap shrink-0 underline-offset-8 transition-colors cursor-pointer ${
              activePage === 'ringkasan'
                ? 'font-semibold text-blue-700 underline decoration-2 dark:text-blue-400'
                : 'text-slate-600 hover:text-slate-900 hover:underline dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Ringkasan
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onSelectPage('katalog');
            }}
            aria-current={activePage === 'katalog' ? 'page' : undefined}
            className={`whitespace-nowrap shrink-0 underline-offset-8 transition-colors cursor-pointer ${
              activePage === 'katalog'
                ? 'font-semibold text-blue-700 underline decoration-2 dark:text-blue-400'
                : 'text-slate-600 hover:text-slate-900 hover:underline dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Katalog
          </button>
        </nav>

        {/* Zone 3: Dark Mode Toggle */}
        <div className="flex shrink-0 items-center">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              triggerHaptic('select');
              onToggleDark();
            }}
            aria-pressed={isDark}
            aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 whitespace-nowrap shrink-0 sm:px-4 sm:text-sm cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
          >
            {isDark ? (
              <>
                <Sun className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                <span>Mode Terang</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 shrink-0 text-slate-600" aria-hidden="true" />
                <span>Mode Gelap</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
}
