import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './features/dashboard/components/DashboardLayout';
import PlaceholderPage from './features/dashboard/pages/PlaceholderPage';
import { useAuth } from './context/AuthContext';

function PublicLayout() {
  const { t } = useTranslation();

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>{t('footer.disclaimer')}</p>
      </footer>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={
            loading ? null : (
              <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schemes" element={<PlaceholderPage moduleId="schemes" />} />
        <Route
          path="/eligibility"
          element={<PlaceholderPage moduleId="eligibility" />}
        />
        <Route path="/help" element={<PlaceholderPage moduleId="help" />} />
        <Route path="/feedback" element={<PlaceholderPage moduleId="feedback" />} />
        <Route path="/profile" element={<PlaceholderPage moduleId="profile" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
