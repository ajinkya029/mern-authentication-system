import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleLogout() {
    setBusy(true);
    setError('');
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <main className="dashboard-shell">
      <header className="dashboard-nav">
        <div className="brand dark-brand"><span className="brand-mark"><ShieldCheck size={21} /></span> AuthFlow</div>
        <button className="logout-button" onClick={handleLogout} disabled={busy}><LogOut size={16} /> {busy ? 'Signing out...' : 'Sign out'}</button>
      </header>
      <section className="dashboard-content">
        <div className="welcome-label"><span className="status-dot" /> AUTHENTICATED SESSION</div>
        <h1>You're in, <span>{user?.name?.split(' ')[0] || 'there'}.</span></h1>
        <p className="dashboard-subtitle">Your account is active. This page is protected by server-side authentication.</p>
        {error && <div className="alert">{error}</div>}
        <div className="profile-card">
          <div className="profile-card-head"><div className="avatar"><UserRound size={24} /></div><div><h2>Account overview</h2><p>Your profile information</p></div><CheckCircle2 className="verified-icon" size={22} /></div>
          <div className="profile-row"><span>Full name</span><strong>{user?.name}</strong></div>
          <div className="profile-row"><span>Email address</span><strong>{user?.email}</strong></div>
          <div className="profile-row"><span>Session status</span><strong className="active-status">Active</strong></div>
        </div>
        <div className="security-note"><ShieldCheck size={19} /><div><strong>Your account is protected</strong><p>Your password is hashed, and your session token is stored in an HTTP-only cookie.</p></div><ArrowUpRight size={17} /></div>
      </section>
      <footer className="dashboard-footer">AuthFlow <span>•</span> MERN authentication starter</footer>
    </main>
  );
}
