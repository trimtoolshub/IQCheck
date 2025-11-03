// API helper for basePath support
export const API_BASE = '/iqcheck';

export function apiUrl(path: string): string {
  // Remove leading slash if present, then add basePath
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE}/${cleanPath}`;
}

