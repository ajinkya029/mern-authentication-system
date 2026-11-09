import { ShieldCheck, Sparkles } from 'lucide-react';

export default function AuthLayout({ children, mode }) {
  return (
    <main className="auth-shell">
      <section className="visual-panel">
        <div className="brand"><span className="brand-mark"><ShieldCheck size={21} /></span> AuthFlow</div>
        <div className="visual-copy">
          <span className="eyebrow"><Sparkles size={14} /> SIMPLE. SECURE. YOURS.</span>
          <h1>Your space.<br /><span>Your rules.</span></h1>
          <p>A clean, secure way to access the tools and experiences that matter to you.</p>
        </div>
        <div className="visual-footer"><span className="status-dot" /> Secure authentication powered by MERN</div>
        <div className="orb orb-one" /><div className="orb orb-two" />
      </section>
      <section className="form-panel">
        <div className="mobile-brand"><ShieldCheck size={20} /> AuthFlow</div>
        <div className="form-wrap">
          {children}
          <p className="form-footnote">Protected with encrypted passwords and secure sessions.</p>
        </div>
        <div className="panel-corner">{mode === 'signup' ? '01 / CREATE ACCOUNT' : '02 / WELCOME BACK'}</div>
      </section>
    </main>
  );
}
