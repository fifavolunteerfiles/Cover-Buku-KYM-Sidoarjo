import { BarChart3, Images, Moon, Search, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { triggerHaptic } from '../utils/haptics';
import type { AppPage } from './HeaderBar';

interface MobileBottomNavProps {
  activePage: AppPage;
  searchFocused: boolean;
  onSelectPage: (page: AppPage) => void;
  isDark: boolean;
  onToggleDark: () => void;
  onFocusSearch: () => void;
}

export function MobileBottomNav({
  activePage,
  searchFocused,
  onSelectPage,
  isDark,
  onToggleDark,
  onFocusSearch,
}: MobileBottomNavProps) {
  const activeTab = searchFocused ? 'cari' : activePage;

  return (
    <nav
      aria-label="Menu navigasi mobile"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden dark:border-slate-800 dark:bg-slate-900/95"
    >
      <div className="mx-auto grid h-16 max-w-md grid-cols-4 items-stretch">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            triggerHaptic('light');
            onSelectPage('ringkasan');
          }}
          aria-current={activeTab === 'ringkasan' ? 'page' : undefined}
          className={`relative flex min-h-[44px] flex-col items-center justify-center gap-1 px-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 cursor-pointer ${
            activeTab === 'ringkasan'
              ? 'text-blue-700 dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          {activeTab === 'ringkasan' && (
            <motion.span
              layoutId="mobile-nav-indicator"
              transition={{ type: 'spring', stiffness: 460, damping: 34 }}
              aria-hidden="true"
              className="absolute top-0 h-0.5 w-8 rounded-b-full bg-blue-700 dark:bg-blue-400"
            />
          )}
          <BarChart3 className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap shrink-0">
            Ringkasan
          </span>
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            triggerHaptic('light');
            onSelectPage('katalog');
          }}
          aria-current={activeTab === 'katalog' ? 'page' : undefined}
          className={`relative flex min-h-[44px] flex-col items-center justify-center gap-1 px-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 cursor-pointer ${
            activeTab === 'katalog'
              ? 'text-blue-700 dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          {activeTab === 'katalog' && (
            <motion.span
              layoutId="mobile-nav-indicator"
              transition={{ type: 'spring', stiffness: 460, damping: 34 }}
              aria-hidden="true"
              className="absolute top-0 h-0.5 w-8 rounded-b-full bg-blue-700 dark:bg-blue-400"
            />
          )}
          <Images className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap shrink-0">
            Katalog
          </span>
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            triggerHaptic('light');
            onFocusSearch();
          }}
          aria-current={activeTab === 'cari' ? 'page' : undefined}
          className={`relative flex min-h-[44px] flex-col items-center justify-center gap-1 px-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 cursor-pointer ${
            activeTab === 'cari'
              ? 'text-blue-700 dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          {activeTab === 'cari' && (
            <motion.span
              layoutId="mobile-nav-indicator"
              transition={{ type: 'spring', stiffness: 460, damping: 34 }}
              aria-hidden="true"
              className="absolute top-0 h-0.5 w-8 rounded-b-full bg-blue-700 dark:bg-blue-400"
            />
          )}
          <Search className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap shrink-0">
            Cari
          </span>
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            triggerHaptic('select');
            onToggleDark();
          }}
          aria-pressed={isDark}
          aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
          className="relative flex min-h-[44px] flex-col items-center justify-center gap-1 px-1 text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 cursor-pointer dark:text-slate-400 dark:hover:text-slate-100"
        >
          {isDark ? (
            <Sun className="h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
          ) : (
            <Moon className="h-5 w-5 shrink-0" aria-hidden="true" />
          )}
          <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap shrink-0">
            {isDark ? 'Terang' : 'Gelap'}
          </span>
        </motion.button>
      </div>
    </nav>
  );
}
