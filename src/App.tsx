import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { Toaster } from './components/ui/Toaster'
import { useAuthStore } from './store/auth.store'

// Code splitting: cada pantalla se carga en su propio chunk bajo demanda.
const SplashPage = lazy(() => import('./pages/SplashPage').then((m) => ({ default: m.SplashPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })))
const ExchangePage = lazy(() => import('./pages/ExchangePage').then((m) => ({ default: m.ExchangePage })))
const OperationsPage = lazy(() => import('./pages/OperationsPage').then((m) => ({ default: m.OperationsPage })))
const OperationDetailPage = lazy(() => import('./pages/OperationDetailPage').then((m) => ({ default: m.OperationDetailPage })))
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const StatusPage = lazy(() => import('./pages/StatusPage').then((m) => ({ default: m.StatusPage })))
const AuctionPage = lazy(() => import('./pages/AuctionPage').then((m) => ({ default: m.AuctionPage })))
const AlertsPage = lazy(() => import('./pages/AlertsPage').then((m) => ({ default: m.AlertsPage })))

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PageLoader() {
  return (
    <div className="mobile-shell items-center justify-center">
      <div className="w-8 h-8 border-2 border-crown-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="w-full flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<SplashPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/exchange" element={<ProtectedRoute><ExchangePage /></ProtectedRoute>} />
            <Route path="/operations" element={<ProtectedRoute><OperationsPage /></ProtectedRoute>} />
            <Route path="/operations/:id" element={<ProtectedRoute><OperationDetailPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/status/:id" element={<ProtectedRoute><StatusPage /></ProtectedRoute>} />
            <Route path="/auction" element={<ProtectedRoute><AuctionPage /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
        <AnimatedRoutes />
        <Toaster />
      </BrowserRouter>
    </MotionConfig>
  )
}

export default App
