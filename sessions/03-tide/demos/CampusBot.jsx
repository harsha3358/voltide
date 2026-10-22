import { useEffect, useRef, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';

// How a basic chatbot "understands": match your words to an intent, then reply.
// Cloud services like Dialogflow, Amazon Lex and Azure Bot do this at scale (plus AI).
const INTENTS = [
  ['fees', ['fee', 'fees', 'pay', 'payment', 'dues'], 'Fees are due by the 10th. Pay on the student portal → Payments. 💳'],
  ['results', ['result', 'results', 'marks', 'grade', 'cgpa'], 'Results go live at 10 AM on the portal. (Hosted on auto-scaling cloud, so no 503 this time 😎)'],
  ['library', ['library', 'book', 'books', 'timing', 'open'], 'The library is open 8 AM–10 PM, Monday to Saturday. 📚'],
  ['fest', ['fest', 'event', 'events', 'concert', 'register'], 'Fest registrations are open! Check the fest site your batch deploys in Episode 04. 🎉'],
  ['wifi', ['wifi', 'wi-fi', 'internet', 'network'], 'Campus Wi-Fi: connect to CAMPUS-NET and log in with your roll number. 📶']
];

function detect(msg) {
  const words = msg.toLowerCase().split(/[^a-z-]+/);
  let best = null;
  let score = 0;
  for (const [name, keys, reply] of INTENTS) {
    const s = keys.filter(k => words.includes(k)).length;
    if (s > score) [best, score] = [{ name, reply }, s];
  }
  return best;
}

export default function CampusBot() {
  const [chat, setChat] = useState([{ who: 'bot', text: 'Hi! I’m CampusBot. Ask me about fees, results, library, fest or Wi-Fi.' }]);
  const [msg, setMsg] = useState('');
  const [hit, setHit] = useState(() => new Set());
  const box = useRef(null);
  useEffect(() => {
    box.current.scrollTop = box.current.scrollHeight;
  }, [chat]);
  useEffect(() => {
    if (hit.size >= 4 && award('demo:bot', 80, 'Chatbot understood 4 intents')) badge('bot-builder');
  }, [hit]);
  const send = text => {
    if (!text.trim()) return;
    const intent = detect(text);
    if (intent) setHit(new Set(hit).add(intent.name));
    setChat(c => [...c, { who: 'you', text }, { who: 'bot', text: intent ? intent.reply : 'Hmm, I don’t know that one yet. A real bot would learn from examples. Try: fees, results, library, fest, Wi-Fi.', intent: intent?.name || 'fallback' }]);
    setMsg('');
  };
  return (
    <div className="split-2-1">
      <div className="d-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div ref={box} style={{ height: 280, overflowY: 'auto', padding: 14, display: 'grid', gap: 8, alignContent: 'start' }}>
          {chat.map((m, i) => (
            <div key={i} style={{ justifySelf: m.who === 'you' ? 'end' : 'start', maxWidth: '85%', padding: '9px 13px', borderRadius: 14, background: m.who === 'you' ? 'var(--accent)' : 'rgba(255,255,255,.06)', color: m.who === 'you' ? '#04101f' : 'var(--text)', fontSize: 14.5 }}>
              {m.text}
              {m.intent && <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4, fontFamily: 'var(--font-mono)' }}>intent: {m.intent}</div>}
            </div>
          ))}
        </div>
        <form className="d-row" style={{ padding: 10, borderTop: '1px solid var(--line)' }} onSubmit={e => { e.preventDefault(); send(msg); }}>
          <input className="input" style={{ flex: 1, minHeight: 42 }} value={msg} onChange={e => setMsg(e.target.value)} placeholder="When are results out?" aria-label="Message CampusBot" />
          <button type="submit" className="btn btn--sm btn--primary">Send</button>
        </form>
      </div>
      <div className="d-panel">
        <span className="d-label">Intents understood · {hit.size}/5</span>
        <ul className="missions">{INTENTS.map(([n]) => <li key={n} className={hit.has(n) ? 'done' : ''}><span>{hit.has(n) ? '✔' : '•'}</span><span>{n}</span></li>)}</ul>
        <div className="d-row" style={{ marginTop: 10 }}>
          {['How do I pay fees?', 'Library timing?', 'Fest registration', 'wifi not working'].map(q => <button key={q} type="button" className="btn btn--sm btn--ghost" onClick={() => send(q)}>{q}</button>)}
        </div>
      </div>
    </div>
  );
}
