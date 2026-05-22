import { createJSONStorage } from 'zustand/middleware'

/**
 * Storage para el middleware `persist` de zustand que revive las cadenas
 * ISO-8601 a objetos `Date` al rehidratar desde localStorage (JSON.parse
 * las deja como string y rompería `.getTime()`, `.toLocaleString()`, etc.).
 */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/

export function dateAwareStorage<S>() {
  return createJSONStorage<S>(() => localStorage, {
    reviver: (_key, value) =>
      typeof value === 'string' && ISO_DATE.test(value) ? new Date(value) : value,
  })
}
