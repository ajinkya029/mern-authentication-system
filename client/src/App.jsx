import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="screen-loader">Loading...</div>;
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
