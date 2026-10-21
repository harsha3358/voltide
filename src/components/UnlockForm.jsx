import { useRef, useState } from 'react';
import { tryUnlock } from '../lib/lock.js';
import { useSpark } from './Spark.jsx';
import { Unlock } from './Icons.jsx';

export default function UnlockForm({ session, onUnlocked }) {
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState(null);
  const formRef = useRef(null);
  const burst = useSpark();
  const submit = e => {
    e.preventDefault();
    if (tryUnlock(session, code)) {
      setMsg({ ok: true, text: 'ACCESS GRANTED: current flowing…' });
      burst(formRef.current);
      setTimeout(() => onUnlocked?.(), 650);
    } else {
      setMsg({ ok: false, text: 'ACCESS DENIED: wrong code. Ask your facilitator.' });
      formRef.current.classList.remove('shake');
      void formRef.current.offsetWidth;
      formRef.current.classList.add('shake');
    }
  };
  return (
    <>
      <form ref={formRef} className="unlock-form" onSubmit={submit}>
        <label className="sr-only" htmlFor={`code-${session.number}`}>
          Facilitator unlock code
        </label>
        <input
          id={`code-${session.number}`}
          className="input"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="ENTER UNLOCK CODE"
          autoComplete="off"
          spellCheck="false"
        />
        <button className="btn btn--primary" type="submit">
          <Unlock /> Unlock
        </button>
      </form>
      <div className={`gate__msg ${msg ? (msg.ok ? 'good' : 'bad') : ''}`} role="status">
        {msg?.text}
      </div>
    </>
  );
}
