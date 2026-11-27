export const SPLASH_DURATION_MS = 2650;
export const SPLASH_REDUCED_DURATION_MS = 900;

export function shouldShowSplash(search: string = ''): boolean {
  if (!search) return true;
  const params = new URLSearchParams(search);
  return params.get('autostart') !== '1' && params.get('skipIntro') !== '1';
}

export function getSplashDurationMs(prefersReducedMotion: boolean): number {
  return prefersReducedMotion ? SPLASH_REDUCED_DURATION_MS : SPLASH_DURATION_MS;
}
