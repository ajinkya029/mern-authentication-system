import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import AuthLayout from '../components/AuthLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function update(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout mode="login">
      <div className="form-heading">
        <span className="eyebrow">GOOD TO SEE YOU</span>
        <h2>Welcome back<span>.</span></h2>
        <p>Enter your details to access your account.</p>
      </div>
      <form onSubmit={submit} className="auth-form">
        {error && <div className="alert">{error}</div>}
        <label htmlFor="email">Email address</label>
        <div className="input-wrap"><Mail size={18} /><input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={update} autoComplete="email" required /></div>
        <div className="label-row"><label htmlFor="password">Password</label></div>
        <div className="input-wrap"><LockKeyhole size={18} /><input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={form.password} onChange={update} autoComplete="current-password" required /><button className="icon-button" type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
        <button className="submit-button" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'} <ArrowRight size={18} /></button>
      </form>
      <p className="switch-copy">New to AuthFlow? <Link to="/signup">Create an account</Link></p>
    </AuthLayout>
  );
}
