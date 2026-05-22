/** Bloque de carga (shimmer) para estados de espera. */
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-subtle ${className}`}
      aria-hidden="true"
    />
  )
}
