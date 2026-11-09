import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import AuthLayout from '../components/AuthLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  function update(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    setBusy(true);
    try {
      await signup(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout mode="signup">
      <div className="form-heading">
        <span className="eyebrow">GET STARTED — IT'S FREE</span>
        <h2>Create account<span>.</span></h2>
        <p>Set up your account in just a few steps.</p>
      </div>
      <form onSubmit={submit} className="auth-form">
        {error && <div className="alert">{error}</div>}
        <label htmlFor="name">Full name</label>
        <div className="input-wrap"><UserRound size={18} /><input id="name" name="name" placeholder="Your name" value={form.name} onChange={update} autoComplete="name" minLength="2" maxLength="60" required /></div>
        <label htmlFor="email">Email address</label>
        <div className="input-wrap"><Mail size={18} /><input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={update} autoComplete="email" required /></div>
        <label htmlFor="password">Password</label>
        <div className="input-wrap"><LockKeyhole size={18} /><input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters" value={form.password} onChange={update} autoComplete="new-password" minLength="8" required /><button className="icon-button" type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
        <p className="field-hint">Use at least 8 characters for a stronger password.</p>
        <button className="submit-button" disabled={busy}>{busy ? 'Creating account...' : 'Create account'} <ArrowRight size={18} /></button>
      </form>
      <p className="switch-copy">Already have an account? <Link to="/login">Sign in</Link></p>
    </AuthLayout>
  );
}
