import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'
import useStore from '../store/useStore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = loading
  const loadUserData = useStore((s) => s.loadUserData)

  useEffect(() => {
    if (!supabaseConfigured) {
      // No Supabase config — skip auth entirely, treat as not logged in
      setSession(null)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) loadUserData(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (event === 'SIGNED_IN' && session?.user) loadUserData(session.user.id)
    })

    return () => subscription.unsubscribe()
  }, [])

  function signInWithGoogle() {
    if (!supabaseConfigured) return
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  function signInWithGitHub() {
    if (!supabaseConfigured) return
    return supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin },
    })
  }

  function signOut() {
    if (!supabaseConfigured) return
    return supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, signInWithGoogle, signInWithGitHub, signOut, supabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
