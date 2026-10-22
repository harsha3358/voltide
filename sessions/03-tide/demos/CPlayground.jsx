import { useEffect, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';

// A pretend gcc: catches the classic beginner mistakes, then "runs" the
// printf lines. Great for a first feel before the real compiler on the VM.
const TEMPLATES = {
  hello: '#include <stdio.h>\n\nint main() {\n    printf("Hello from my cloud VM!\\n");\n    return 0;\n}\n',
  broken: '#include <stdio.h>\n\nint main() {\n    printf("Fix me, I am missing something\\n")\n    return 0;\n}\n',
  loop: '#include <stdio.h>\n\nint main() {\n    for (int i = 1; i <= 3; i++) {\n        printf("Server %d is up\\n", i);\n    }\n    return 0;\n}\n'
};

function compile(src) {
  const lines = src.split('\n');
  const errors = [];
  if (!/#include\s*<stdio\.h>/.test(src)) errors.push("hello.c: warning: implicit declaration of function 'printf' (add #include <stdio.h>)");
  if (!/int\s+main\s*\(/.test(src)) errors.push("undefined reference to `main' (every C program needs int main())");
  lines.forEach((l, i) => {
    const t = l.trim();
    if (/^(printf|return)\b/.test(t) && !t.endsWith(';')) errors.push(`hello.c:${i + 1}: error: expected ';' before the next statement`);
  });
  const open = (src.match(/{/g) || []).length;
  const close = (src.match(/}/g) || []).length;
  if (open !== close) errors.push('hello.c: error: expected declaration or statement at end of input (unbalanced { })');
  return errors;
}

function run(src) {
  const out = [];
  const loop = src.match(/for\s*\(\s*int\s+(\w)\s*=\s*(\d+)\s*;\s*\w\s*<=?\s*(\d+)/);
  const prints = [...src.matchAll(/printf\("((?:[^"\\]|\\.)*)"(?:\s*,\s*(\w))?\)/g)];
  const fmt = (s, v) => s.replace(/%d/g, v).replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  if (loop) {
    const [, , a, b] = loop;
    for (let v = +a; v <= +b && v - a < 20; v++) prints.forEach(([, s]) => out.push(fmt(s, v)));
  } else prints.forEach(([, s]) => out.push(fmt(s, '')));
  return out.join('');
}

export default function CPlayground() {
  const [src, setSrc] = useState(TEMPLATES.hello);
  const [term, setTerm] = useState('');
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (ok && award('demo:c', 100, 'Compiled and ran C')) badge('compiler');
  }, [ok]);
  const build = () => {
    const errs = compile(src);
    if (errs.length) {
      setOk(false);
      setTerm(`$ gcc hello.c -o hello\n${errs.join('\n')}\ncompilation failed`);
    } else {
      setOk(true);
      setTerm(`$ gcc hello.c -o hello\n$ ./hello\n${run(src)}`);
    }
  };
  return (
    <div className="split-2-1">
      <div>
        <div className="d-row" style={{ marginBottom: 8 }}>
          <button type="button" className="btn btn--sm" onClick={() => { setSrc(TEMPLATES.hello); setTerm(''); }}>Hello world</button>
          <button type="button" className="btn btn--sm" onClick={() => { setSrc(TEMPLATES.broken); setTerm(''); }}>Broken (fix it!)</button>
          <button type="button" className="btn btn--sm" onClick={() => { setSrc(TEMPLATES.loop); setTerm(''); }}>Loop</button>
        </div>
        <label className="sr-only" htmlFor="c-src">C source code</label>
        <textarea id="c-src" className="input" style={{ width: '100%', minHeight: 230, fontFamily: 'var(--font-mono)', fontSize: 14 }} value={src} onChange={e => setSrc(e.target.value)} spellCheck="false" />
        <button type="button" className="btn btn--primary" style={{ marginTop: 8 }} onClick={build}>⚙️ Compile &amp; run</button>
      </div>
      <div className="term-sim">
        <div className="term-sim__screen" style={{ height: 300 }}>
          {term ? term.split('\n').map((l, i) => <div key={i} className={/error|failed|warning/.test(l) ? 'err' : l.startsWith('$') ? 'p' : 'o'}>{l || ' '}</div>) : <div className="hint">Press “Compile &amp; run”. Try the broken one and fix it.</div>}
        </div>
      </div>
    </div>
  );
}
