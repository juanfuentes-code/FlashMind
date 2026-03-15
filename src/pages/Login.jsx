import { useAuth } from '../context/AuthContext'
import { supabaseConfigured } from '../lib/supabase'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12Z"/>
    </svg>
  )
}

export default function Login() {
  const { signInWithGoogle, signInWithGitHub } = useAuth()

  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#111827] border border-amber-500/30 rounded-2xl p-8 text-center">
          <div className="text-amber-400 text-3xl mb-3">⚙️</div>
          <h2 className="text-white font-semibold mb-2">Supabase no configurado</h2>
          <p className="text-slate-400 text-sm mb-4">
            Rellena <code className="text-amber-400 bg-white/10 px-1 rounded">.env</code> con tus credenciales de Supabase para activar el login.
          </p>
          <pre className="text-left text-xs bg-[#0a0f1e] rounded-xl p-3 text-slate-300 overflow-auto">
{`VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...`}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
              <path d="M7 8h2M11 8h6M7 12h4M13 12h4"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">FlashMind</h1>
          <p className="text-slate-400 mt-1 text-sm">Aprende con inteligencia</p>
        </div>

        {/* Card */}
        <div className="bg-[#111827] border border-slate-700/50 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-white text-center mb-1">Bienvenido</h2>
          <p className="text-slate-400 text-sm text-center mb-6">
            Inicia sesión para sincronizar tu progreso en todos tus dispositivos
          </p>

          <div className="space-y-3">
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-slate-100 text-slate-900 font-medium rounded-xl transition-colors"
            >
              <GoogleIcon />
              Continuar con Google
            </button>

            <button
              onClick={signInWithGitHub}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1a1f2e] hover:bg-[#242938] border border-slate-600 text-white font-medium rounded-xl transition-colors"
            >
              <GitHubIcon />
              Continuar con GitHub
            </button>
          </div>

          <p className="text-slate-500 text-xs text-center mt-6">
            Al continuar, aceptas que tus datos se sincronicen de forma segura
          </p>
        </div>
      </div>
    </div>
  )
}
