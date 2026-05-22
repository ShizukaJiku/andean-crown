export function formatPEN(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatRate(rate: number): string {
  return rate.toFixed(4)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diffMs = Date.now() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'justo ahora'
  if (diffMin < 60) return `hace ${diffMin} min`
  const diffHrs = Math.floor(diffMin / 60)
  if (diffHrs < 24) return `hace ${diffHrs}h`
  return formatDate(d)
}

/**
 * Agrupa los miles de la parte entera de una cadena numérica cruda,
 * preservando el punto decimal mientras el usuario escribe.
 * "5000" → "5,000" · "1234.5" → "1,234.5" · "1234." → "1,234."
 */
export function groupThousands(raw: string): string {
  if (!raw) return ''
  const dot = raw.indexOf('.')
  const intPart = dot === -1 ? raw : raw.slice(0, dot)
  const decPart = dot === -1 ? '' : raw.slice(dot)
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return grouped + decPart
}

export function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
