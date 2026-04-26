// Résout les chemins d'assets pour GitHub Pages (base: /Becomeusapp/) et Skywork (base: /)
export function assetUrl(path: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const p = path.startsWith('/') ? path : '/' + path;
  return base + p;
}
