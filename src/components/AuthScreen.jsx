import { useEffect, useId, useState } from 'react';
import Backdrop from './Backdrop.jsx';
import Logo from './Logo.jsx';
import ErrorToon from './ErrorToon.jsx';
import Scene3D from './Scene3D.jsx';
import { login, requestOtp, resetPassword, signup } from '../lib/auth.js';
import { ApiError } from '../lib/backend.js';

// The front door when the site is connected to Google Sheets: sign up with
// name, registration number and email; log in with a password; reset a
// forgotten password with a code sent to the student's email.
export default function AuthScreen() {
  const [mode, setMode] = useState('login');
  return (
    <div className="auth">
      <Backdrop kind="world" opacity={0.9} />
      <div className="wrap auth__grid">
        <div className="auth__pitch">
          <div className="auth__brand">
            <Logo />
            <span>VOLTIDE</span>
          </div>
          <h1>Learn the cloud. Ship something real.</h1>
          <p>Four episodes, 38 missions, one boss to beat. Log in so your XP, badges and progress follow you to any computer.</p>
          <Scene3D name="globe" className="auth__globe" label="A 3D globe of cloud regions" />
        </div>
        <div className="auth__card">
          {mode !== 'forgot' && (
            <div className="seg auth__tabs" role="tablist">
              <button type="button" role="tab" aria-selected={mode === 'login'} aria-pressed={mode === 'login'} onClick={() => setMode('login')}>Log in</button>
              <button type="button" role="tab" aria-selected={mode === 'signup'} aria-pressed={mode === 'signup'} onClick={() => setMode('signup')}>Sign up</button>
            </div>
          )}
          {mode === 'login' && <LoginForm onForgot={() => setMode('forgot')} onSignup={() => setMode('signup')} />}
          {mode === 'signup' && <SignupForm onLogin={() => setMode('login')} />}
          {mode === 'forgot' && <OtpReset onBack={() => setMode('login')} />}
        </div>
      </div>
    </div>
  );
}

// Shared bits ---------------------------------------------------------------

export function Field({ label, hint, ...props }) {
  return (
    <label className="auth__field">
      <span>{label}</span>
      <input className="input" {...props} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function PasswordField({ label = 'Password', ...props }) {
  const [show, setShow] = useState(false);
  const id = useId();
  return (
    <div className="auth__field">
      <label htmlFor={id}>{label}</label>
      <span className="auth__pw">
        <input id={id} className="input" type={show ? 'text' : 'password'} minLength={8} {...props} />
        <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>{show ? '🙈' : '👁️'}</button>
      </span>
    </div>
  );
}

function useSubmit() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const run = async fn => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(500, e.message));
    }
    setBusy(false);
  };
  return { busy, error, setError, run };
}

const Err = ({ error }) => (error ? <ErrorToon compact code={error.code} message={error.message} /> : null);

// Forms -----------------------------------------------------------------------

function LoginForm({ onForgot, onSignup }) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const { busy, error, run } = useSubmit();
  return (
    <form className="auth__form" onSubmit={e => (e.preventDefault(), run(() => login(id.trim(), pw)))}>
      <h2>Welcome back 👋</h2>
      <Err error={error} />
      <Field label="Registration number or email" value={id} onChange={e => setId(e.target.value)} autoComplete="username" required autoFocus />
      <PasswordField value={pw} onChange={e => setPw(e.target.value)} autoComplete="current-password" required />
      <button type="submit" className="btn btn--primary auth__submit" disabled={busy}>{busy ? 'Logging in…' : 'Log in ⚡'}</button>
      <div className="auth__links">
        <button type="button" className="auth__link" onClick={onForgot}>Forgot password?</button>
        <button type="button" className="auth__link" onClick={onSignup}>New here? Sign up</button>
      </div>
    </form>
  );
}

function SignupForm({ onLogin }) {
  const [f, setF] = useState({ name: '', regNo: '', email: '', password: '', confirm: '' });
  const { busy, error, setError, run } = useSubmit();
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = e => {
    e.preventDefault();
    if (f.password !== f.confirm) return setError(new ApiError(400, 'The two passwords don’t match.'));
    run(() => signup({ name: f.name.trim(), regNo: f.regNo.trim(), email: f.email.trim(), password: f.password }));
  };
  return (
    <form className="auth__form" onSubmit={submit}>
      <h2>Create your account</h2>
      <Err error={error} />
      <Field label="Full name" value={f.name} onChange={set('name')} autoComplete="name" required maxLength={60} />
      <Field label="Registration number" value={f.regNo} onChange={set('regNo')} autoComplete="off" required maxLength={25} hint="Exactly as on your college ID, e.g. 24BCE1234" />
      <Field label="Email" type="email" value={f.email} onChange={set('email')} autoComplete="email" required hint="Your OTP codes are sent here, so use one you can open now." />
      <PasswordField value={f.password} onChange={set('password')} autoComplete="new-password" required />
      <PasswordField label="Confirm password" value={f.confirm} onChange={set('confirm')} autoComplete="new-password" required />
      <button type="submit" className="btn btn--primary auth__submit" disabled={busy}>{busy ? 'Creating…' : 'Sign up and start 🚀'}</button>
      <div className="auth__links">
        <button type="button" className="auth__link" onClick={onLogin}>Already have an account? Log in</button>
      </div>
    </form>
  );
}

// Step 1: send a code to the email. Step 2: code + new password.
// Also used on the profile page to change a password (purpose = 'change').
export function OtpReset({ onBack, fixedId, purpose = 'forgot' }) {
  const [id, setId] = useState(fixedId || '');
  const [sent, setSent] = useState(null);
  const [otp, setOtp] = useState('');
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [wait, setWait] = useState(0);
  const { busy, error, setError, run } = useSubmit();
  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);
  const send = () =>
    run(async () => {
      const d = await requestOtp(id.trim(), purpose);
      setSent(d);
      setWait(60);
    });
  const change = e => {
    e.preventDefault();
    if (pw !== confirm) return setError(new ApiError(400, 'The two passwords don’t match.'));
    run(() => resetPassword(id.trim(), otp.trim(), pw));
  };
  return (
    <div className="auth__form">
      <h2>{purpose === 'change' ? 'Change your password' : 'Reset your password'}</h2>
      <Err error={error} />
      {!sent ? (
        <form onSubmit={e => (e.preventDefault(), send())} className="auth__form" style={{ padding: 0 }}>
          {!fixedId && <Field label="Registration number or email" value={id} onChange={e => setId(e.target.value)} required autoFocus />}
          <p className="d-note" style={{ margin: 0 }}>We’ll email a 6-digit code to the address on your account.</p>
          <button type="submit" className="btn btn--primary auth__submit" disabled={busy}>{busy ? 'Sending…' : 'Send me a code 📩'}</button>
        </form>
      ) : (
        <form onSubmit={change} className="auth__form" style={{ padding: 0 }}>
          <p className="auth__sent">Code sent to <strong>{sent.sentTo}</strong>. It works for {sent.minutes} minutes. Check spam too.</p>
          <Field label="6-digit code" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" required pattern="\d{6}" className="input auth__otp" autoFocus />
          <PasswordField label="New password" value={pw} onChange={e => setPw(e.target.value)} autoComplete="new-password" required />
          <PasswordField label="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" required />
          <button type="submit" className="btn btn--primary auth__submit" disabled={busy}>{busy ? 'Saving…' : 'Set new password ✓'}</button>
          <button type="button" className="auth__link" disabled={wait > 0 || busy} onClick={send}>{wait > 0 ? `Resend code in ${wait}s` : 'Resend code'}</button>
        </form>
      )}
      {onBack && (
        <div className="auth__links">
          <button type="button" className="auth__link" onClick={onBack}>← Back</button>
        </div>
      )}
    </div>
  );
}
