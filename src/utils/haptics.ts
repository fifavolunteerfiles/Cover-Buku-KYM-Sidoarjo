export type HapticStyle = 'light' | 'medium' | 'select' | 'reset';

export const HAPTIC_PATTERNS: Record<HapticStyle, number | number[]> = {
  light: 8,
  medium: 12,
  select: [6, 20, 8],
  reset: [10, 24, 10],
};

export interface HapticEnvironment {
  navigator?: {
    vibrate?: (pattern: number | number[]) => boolean;
  };
  window?: {
    matchMedia?: (query: string) => { matches: boolean };
  };
}

export function getHapticPattern(style: HapticStyle = 'light'): number | number[] {
  return HAPTIC_PATTERNS[style];
}

export function prefersReducedMotion(
  win: HapticEnvironment['window'] = typeof window !== 'undefined' ? window : undefined
): boolean {
  try {
    return Boolean(win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  } catch {
    return false;
  }
}

export function triggerHaptic(
  style: HapticStyle = 'light',
  env?: HapticEnvironment
): boolean {
  const targetWindow = env?.window ?? (typeof window !== 'undefined' ? window : undefined);
  const targetNav = env?.navigator ?? (typeof navigator !== 'undefined' ? navigator : undefined);

  if (prefersReducedMotion(targetWindow)) {
    return false;
  }

  if (typeof targetNav?.vibrate !== 'function') {
    return false;
  }

  try {
    return Boolean(targetNav.vibrate(getHapticPattern(style)));
  } catch {
    return false;
  }
}
