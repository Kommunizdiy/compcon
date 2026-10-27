// Root-relative paths to files in /public ("/img/...") break when the app is served from a
// sub-path such as https://user.github.io/compcon/. Prefix them with Vite's base URL.
export function publicUrl(path: string): string {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return path
  return import.meta.env.BASE_URL.replace(/\/$/, '') + path
}
