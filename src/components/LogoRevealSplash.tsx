import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { getSplashDurationMs } from '../utils/splash';
import { KYM_LOGO_PATH, resolvePublicAsset } from '../utils/assets';

interface LogoRevealSplashProps {
  visible: boolean;
  onFinish: () => void;
}

const SPARK_POSITIONS = [
  { x: -118, y: -64, delay: 0.45, color: 'bg-red-500' },
  { x: 122, y: -58, delay: 0.55, color: 'bg-amber-400' },
  { x: -126, y: 54, delay: 0.65, color: 'bg-blue-600' },
  { x: 116, y: 66, delay: 0.75, color: 'bg-amber-500' },
];

export function LogoRevealSplash({ visible, onFinish }: LogoRevealSplashProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    if (!visible) return;

    const totalMs = getSplashDurationMs(prefersReducedMotion);
    const displayMs = Math.max(450, totalMs - 450);

    const finishTimer = window.setTimeout(() => {
      onFinish();
    }, displayMs);

    return () => {
      window.clearTimeout(finishTimer);
    };
  }, [visible, prefersReducedMotion, onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-testid="logo-reveal-splash"
          aria-live="polite"
          aria-label="Pembukaan Komunitas Yuk Menulis Sidoarjo"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 1.03,
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-white px-6 select-none dark:bg-slate-950"
        >
          {/* Solid-backed subtle editorial gradient layer */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-blue-50/80 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/60"
          />

          {/* Ambient radial glow */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(29,78,216,0.14)_0%,rgba(245,158,11,0.08)_42%,transparent_72%)] blur-2xl sm:h-[520px] sm:w-[520px] dark:bg-[radial-gradient(circle,rgba(59,130,246,0.22)_0%,rgba(245,158,11,0.1)_42%,transparent_72%)]"
          />

          {/* Centerpiece emblem + typography */}
          <div className="relative flex flex-col items-center text-center">
            {/* Orbiting geometric halo rings */}
            <div className="relative flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48">
              {!prefersReducedMotion && (
                <>
                  {/* Outer expanding pulse ring */}
                  <motion.span
                    aria-hidden="true"
                    initial={{ opacity: 0.65, scale: 0.65 }}
                    animate={{ opacity: 0, scale: 1.55 }}
                    transition={{ duration: 1.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 rounded-full border-2 border-blue-600/35 dark:border-blue-400/35"
                  />

                  {/* Tri-color rotating outer dashed orbit */}
                  <motion.div
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 90 }}
                    transition={{ duration: 2.3, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute -inset-3 rounded-full border border-dashed border-amber-500/50 dark:border-amber-400/40"
                  />

                  {/* Subtle inner royal-blue orbital ring */}
                  <motion.div
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.78, rotate: 30 }}
                    animate={{ opacity: 0.9, scale: 1, rotate: -30 }}
                    transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute -inset-1 rounded-full border border-blue-700/20 dark:border-blue-400/25"
                  />

                  {/* Literary spark accents */}
                  {SPARK_POSITIONS.map((spark, idx) => (
                    <motion.span
                      key={idx}
                      aria-hidden="true"
                      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                      animate={{
                        opacity: [0, 1, 0.75],
                        scale: [0, 1.15, 0.9],
                        x: spark.x * 0.72,
                        y: spark.y * 0.72,
                      }}
                      transition={{
                        duration: 1.1,
                        delay: spark.delay,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`absolute h-2 w-2 rounded-full ${spark.color} shadow-xs`}
                    />
                  ))}
                </>
              )}

              {/* Circular emblem card with specular shimmer sweep */}
              <motion.div
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.68, rotate: -8 }
                }
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 220,
                  damping: 20,
                  mass: 0.9,
                  delay: 0.08,
                }}
                className="relative z-10 h-32 w-32 overflow-hidden rounded-full border-2 border-white bg-white p-1.5 shadow-[0_20px_50px_-12px_rgba(15,76,129,0.28)] ring-1 ring-blue-900/10 sm:h-40 sm:w-40 dark:border-slate-800 dark:ring-blue-300/20"
              >
                <img
                  src={resolvePublicAsset(KYM_LOGO_PATH)}
                  alt="Logo Komunitas Yuk Menulis Sidoarjo"
                  className="h-full w-full rounded-full object-contain"
                />

                {/* Diagonal specular sheen passing over emblem */}
                {!prefersReducedMotion && (
                  <motion.div
                    aria-hidden="true"
                    initial={{ x: '-140%', opacity: 0 }}
                    animate={{ x: '160%', opacity: [0, 0.65, 0] }}
                    transition={{ duration: 0.85, delay: 0.55, ease: 'easeInOut' }}
                    className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-20 bg-gradient-to-r from-transparent via-white/80 to-transparent"
                  />
                )}
              </motion.div>
            </div>

            {/* Tri-color ribbon hairline (Crimson · Royal Blue · Amber) */}
            <motion.div
              aria-hidden="true"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 h-1 w-28 origin-center rounded-full bg-gradient-to-r from-red-600 via-blue-700 to-amber-500 sm:mt-6 sm:w-36"
            />

            {/* Staggered masked editorial typography */}
            <div className="mt-4 overflow-hidden">
              <motion.h2
                initial={prefersReducedMotion ? { opacity: 0 } : { y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100"
              >
                Komunitas Yuk Menulis
              </motion.h2>
            </div>

            <div className="mt-1.5 overflow-hidden">
              <motion.p
                initial={prefersReducedMotion ? { opacity: 0 } : { y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.68, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs font-bold tracking-[0.22em] text-blue-700 uppercase sm:text-sm dark:text-blue-400"
              >
                Kabupaten Sidoarjo · Katalog Sampul Buku
              </motion.p>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2.5 text-sm font-medium italic text-slate-500 sm:text-base dark:text-slate-400"
            >
              Nyalakan literasi untuk negeri
            </motion.p>

            {/* Minimalist silent loading progress hairline (pure visual pacing, zero buttons) */}
            <div
              aria-hidden="true"
              className="mt-6 h-0.5 w-40 overflow-hidden rounded-full bg-slate-200/80 sm:w-48 dark:bg-slate-800"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: prefersReducedMotion ? 0.55 : 1.75,
                  delay: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full w-full origin-left bg-gradient-to-r from-red-600 via-blue-700 to-amber-500"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
