import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Play, BookOpen, BarChart3, Upload } from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Inicio' },
  { to: '/review', icon: Play, label: 'Repasar' },
  { to: '/glossary', icon: BookOpen, label: 'Glosario' },
  { to: '/stats', icon: BarChart3, label: 'Stats' },
  { to: '/import', icon: Upload, label: 'Importar' },
]

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-900/95 backdrop-blur-xl border-t border-white/5 px-2 py-2 z-50">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-all ${
                isActive
                  ? 'text-primary-400'
                  : 'text-surface-200/40 hover:text-surface-200/70'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
