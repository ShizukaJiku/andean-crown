import { useLocation, useNavigate } from 'react-router-dom'
import { Home, ArrowLeftRight, Clock, User } from 'lucide-react'
import { cn } from '../../lib/cn'

const navItems = [
  { path: '/home', icon: Home, label: 'Inicio' },
  { path: '/exchange', icon: ArrowLeftRight, label: 'Cambiar' },
  { path: '/operations', icon: Clock, label: 'Historial' },
  { path: '/profile', icon: User, label: 'Perfil' },
]

export function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-surface border-t border-border z-50"
    >
      <div className="flex items-center justify-around px-2 pb-safe">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = pathname.startsWith(path)
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center gap-0.5 py-3 px-4 min-w-[44px] min-h-[44px] transition-colors',
                active ? 'text-crown-navy' : 'text-muted hover:text-text'
              )}
            >
              <div className={cn(
                'p-1.5 rounded-xl transition-colors',
                active && 'bg-crown-gold/15'
              )}>
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} aria-hidden="true" />
              </div>
              <span className={cn('text-[10px] font-medium', active && 'font-semibold')}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
