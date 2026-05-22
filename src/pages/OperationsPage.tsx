import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowLeftRight } from 'lucide-react'
import { BottomNav } from '../components/ui/BottomNav'
import { Skeleton } from '../components/ui/Skeleton'
import { OperationCard } from '../components/features/OperationCard'
import { useUserOperations } from '../store/operations.store'
import type { OperationStatus } from '../data/mock-operations'
import { cn } from '../lib/cn'

type Filter = 'all' | OperationStatus

const filters: { label: string; value: Filter }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Completadas', value: 'completado' },
  { label: 'En proceso', value: 'procesando' },
  { label: 'Pendientes', value: 'pendiente_pago' },
  { label: 'Observadas', value: 'observado' },
]

export function OperationsPage() {
  const navigate = useNavigate()
  const operations = useUserOperations()
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [])

  const filtered = operations.filter((op) => {
    const matchFilter = filter === 'all' || op.status === filter
    const matchSearch =
      !search ||
      op.number.toLowerCase().includes(search.toLowerCase()) ||
      op.bank.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="mobile-shell">
      {/* Header */}
      <div className="bg-crown-navy px-5 pt-safe pt-6 pb-5">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-white">Historial</h1>
          <span className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded-full">
            {operations.length} operaciones
          </span>
        </div>
        <p className="text-sm text-white/70">Tus cambios de divisas</p>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-3 bg-surface border-b border-border">
        <div className="flex items-center gap-2 bg-subtle rounded-xl px-3 py-2.5 transition-shadow focus-within:ring-2 focus-within:ring-crown-gold/30">
          <Search size={16} className="text-muted shrink-0" />
          <input
            type="text"
            placeholder="Buscar por número o banco..."
            aria-label="Buscar operaciones por número o banco"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-text placeholder:text-muted outline-none"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-4 py-3 border-b border-border overflow-x-auto">
        <div className="flex gap-2 w-max">
          {filters.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={cn(
                'px-3 py-1.5 min-h-[40px] inline-flex items-center rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                filter === value
                  ? 'bg-crown-navy text-white'
                  : 'bg-subtle text-muted hover:bg-border'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Operations list */}
      <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        {loading ? (
          <div className="flex flex-col gap-2" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <OperationCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="flex flex-col gap-2">
            {filtered.map((op) => (
              <OperationCard key={op.id} operation={op} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-16 h-16 bg-subtle rounded-2xl flex items-center justify-center">
              <ArrowLeftRight size={24} className="text-muted" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-text">Sin operaciones</p>
              <p className="text-xs text-muted mt-1">
                {search ? 'No se encontraron resultados' : 'Aún no tienes operaciones en este estado'}
              </p>
            </div>
            {!search && (
              <button
                type="button"
                onClick={() => navigate('/exchange')}
                className="text-sm font-semibold text-crown-gold-dim min-h-[44px] px-3"
              >
                Realizar un cambio
              </button>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

function OperationCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 bg-surface border border-border rounded-2xl">
      <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}
