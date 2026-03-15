import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Play,
  BookOpen,
  BarChart3,
  Upload,
  Sparkles,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/review', icon: Play, label: 'Repasar' },
  { to: '/glossary', icon: BookOpen, label: 'Glosario' },
  { to: '/stats', icon: BarChart3, label: 'Estadísticas' },
  { to: '/import', icon: Upload, label: 'Importar' },
]

export default function Sidebar() {
  const { user, signOut } = useAuth()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-900/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">FlashMind</h1>
          <p className="text-[11px] text-surface-200/50 -mt-0.5">Aprende con inteligencia</p>
        </div>
      </div>

      <nav className="flex-1 px-3 mt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500/15 text-primary-400 shadow-sm shadow-primary-500/10'
                  : 'text-surface-200/60 hover:text-surface-200 hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-[18px] h-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 mb-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
            {user?.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          <span className="text-xs text-surface-200/60 truncate flex-1">{user?.email}</span>
          <button
            onClick={signOut}
            title="Cerrar sesión"
            className="text-surface-200/40 hover:text-red-400 transition-colors flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 mx-3 mb-4 rounded-xl bg-gradient-to-br from-primary-600/20 to-accent-600/20 border border-white/5">
        <p className="text-xs text-surface-200/70 leading-relaxed">
          Mantener la consistencia es la clave del aprendizaje efectivo.
        </p>
      </div>
    </aside>
  )
}
