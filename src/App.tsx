import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SplashPage } from './pages/SplashPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { HomePage } from './pages/HomePage'
import { ExchangePage } from './pages/ExchangePage'
import { OperationsPage } from './pages/OperationsPage'
import { OperationDetailPage } from './pages/OperationDetailPage'
import { ProfilePage } from './pages/ProfilePage'
import { StatusPage } from './pages/StatusPage'
import { AuctionPage } from './pages/AuctionPage'
import { AlertsPage } from './pages/AlertsPage'
import { useAuthStore } from './store/auth.store'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      <div className="mobile-shell">
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/home"
            element={<ProtectedRoute><HomePage /></ProtectedRoute>}
          />
          <Route
            path="/exchange"
            element={<ProtectedRoute><ExchangePage /></ProtectedRoute>}
          />
          <Route
            path="/operations"
            element={<ProtectedRoute><OperationsPage /></ProtectedRoute>}
          />
          <Route
            path="/operations/:id"
            element={<ProtectedRoute><OperationDetailPage /></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
          />
          <Route
            path="/status/:id"
            element={<ProtectedRoute><StatusPage /></ProtectedRoute>}
          />
          <Route
            path="/auction"
            element={<ProtectedRoute><AuctionPage /></ProtectedRoute>}
          />
          <Route
            path="/alerts"
            element={<ProtectedRoute><AlertsPage /></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
