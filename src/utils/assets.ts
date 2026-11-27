export const KYM_LOGO_PATH = 'assets/aistudio/IMG_8414_ecf9e34e.JPG';

export function resolvePublicAsset(relativePath: string, baseUrl?: string): string {
  const metaEnv = (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env;
  const rawBase = baseUrl ?? metaEnv?.BASE_URL ?? '/';
  const normalizedBase = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
  const cleanPath = relativePath.replace(/^\/+/, '');
  return `${normalizedBase}${cleanPath}`;
}
