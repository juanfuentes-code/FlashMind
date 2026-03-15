import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ReviewSession from './pages/ReviewSession'
import Glossary from './pages/Glossary'
import Statistics from './pages/Statistics'
import Import from './pages/Import'
import Login from './pages/Login'

function ProtectedRoute({ children }) {
  const { session } = useAuth()

  // Still loading session
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="review" element={<ReviewSession />} />
            <Route path="glossary" element={<Glossary />} />
            <Route path="stats" element={<Statistics />} />
            <Route path="import" element={<Import />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
