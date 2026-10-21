import { useEffect, useRef, useState } from 'react';
import { useSpark } from '../../../src/components/Spark.jsx';
import { award, badge } from '../../../src/lib/game.js';

// A pretend Linux terminal for absolute beginners. Nothing here touches a real
// computer, so it is a safe place to make mistakes before using the real VM.
const START = {
  '/home/student': { type: 'dir' },
  '/home/student/notes.txt': { type: 'file', perm: '-rw-r--r--', body: 'Welcome to Linux!\nEverything in Linux is a file, even devices.\nTip: press the up arrow to repeat a command.' },
  '/home/student/secret.txt': { type: 'file', perm: '-rw-------', body: 'Only the owner (student) can read this file. Check with: ls -l' },
  '/home/student/.hidden_flag': { type: 'file', perm: '-rw-r--r--', body: 'VOLTIDE{h1dd3n_f1l3s_st4rt_w1th_a_d0t}\nFiles starting with a dot are hidden. You found it with ls -a. Nice!' },
  '/home/student/projects': { type: 'dir' },
  '/home/student/projects/hello.sh': { type: 'file', perm: '-rw-r--r--', body: '#!/bin/bash\necho "Hello from your first script!"' }
};

const MISSIONS = [
  ['whoami', 'Find out who you are logged in as', c => c === 'whoami'],
  ['pwd', 'Print where you are (your working directory)', c => c === 'pwd'],
  ['ls', 'List the files here', c => /^ls(\s|$)/.test(c)],
  ['cat notes.txt', 'Read notes.txt', c => /^cat\s+(\.\/)?notes\.txt$/.test(c)],
  ['ls -a', 'Find the hidden file (and read it!)', c => /^cat\s+.*\.hidden_flag$/.test(c)],
  ['mkdir lab', 'Make a new folder called lab', c => /^mkdir\s+lab$/.test(c)],
  ['cd projects', 'Move into the projects folder', c => /^cd\s+(\.\/)?projects\/?$/.test(c)],
  ['chmod +x hello.sh', 'Make hello.sh executable, then run ./hello.sh', c => c === './hello.sh']
];

const HELP = `Commands you can try:
  whoami            who am I logged in as?
  pwd               print working directory (where am I?)
  ls  [-l] [-a]     list files (-l = details, -a = show hidden)
  cd <folder>       change directory   (cd .. = go up, cd ~ = home)
  cat <file>        print a file's contents
  mkdir <name>      make a directory (folder)
  touch <name>      create an empty file
  echo <text>       print text   (echo hi > file.txt writes to a file)
  chmod +x <file>   make a file executable
  ./<script>        run a script
  rm <file>         remove a file (careful: there is no recycle bin!)
  ip a | date | uname -a | history | clear | man <cmd>`;

const MAN = {
  ls: 'ls: list directory contents. -l long format (permissions, owner, size). -a include hidden dot-files.',
  cd: 'cd: change directory. "cd .." goes up one level, "cd ~" or plain "cd" goes home.',
  cat: 'cat: concatenate and print files. Mostly used to read a file quickly.',
  chmod: 'chmod: change file permissions. r = read, w = write, x = execute. "+x" adds execute permission.',
  sudo: 'sudo: run one command as the administrator (root). Powerful, so use it carefully.',
  pwd: 'pwd: print the full path of the directory you are in.',
  whoami: 'whoami: print the user name you are logged in as.'
};

export default function TerminalSim() {
  const [fs, setFs] = useState(START);
  const [cwd, setCwd] = useState('/home/student');
  const [lines, setLines] = useState([{ t: 'hint', s: 'VOLTIDE practice shell. Nothing here can break a real computer.\nType  help  and press Enter. Missions are on the right →' }]);
  const [input, setInput] = useState('');
  const [hist, setHist] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const [done, setDone] = useState(() => new Set());
  const screen = useRef(null);
  const inputRef = useRef(null);
  const burst = useSpark();

  useEffect(() => {
    screen.current.scrollTop = screen.current.scrollHeight;
  }, [lines]);
  useEffect(() => {
    if (done.size === MISSIONS.length && award('demo:terminal', 150, 'All 8 terminal missions')) badge('terminal-tamer');
  }, [done]);

  const short = p => p.replace('/home/student', '~');
  const resolve = arg => {
    if (!arg || arg === '~') return '/home/student';
    const base = arg.startsWith('/') ? '' : arg.startsWith('~') ? '/home/student' : cwd;
    const parts = base.split('/').filter(Boolean);
    for (const seg of arg.replace(/^~/, '').split('/').filter(Boolean)) {
      if (seg === '..') parts.pop();
      else if (seg !== '.') parts.push(seg);
    }
    return '/' + parts.join('/');
  };
  const children = dir =>
    Object.keys(fs)
      .filter(p => p.startsWith(dir + '/') && !p.slice(dir.length + 1).includes('/'))
      .map(p => p.slice(dir.length + 1))
      .sort();

  const run = raw => {
    const cmd = raw.trim();
    const out = [{ t: 'p', s: `student@voltide:${short(cwd)}$ ${cmd}` }];
    const say = (s, t = 'o') => out.push({ t, s });
    const [name, ...args] = cmd.split(/\s+/);
    const flags = args.filter(a => a.startsWith('-')).join('');
    const target = args.find(a => !a.startsWith('-'));
    let nextFs = fs;
    let nextCwd = cwd;
    switch (name) {
      case '':
        break;
      case 'help':
        say(HELP);
        break;
      case 'whoami':
        say('student');
        break;
      case 'pwd':
        say(cwd);
        break;
      case 'ls': {
        const dir = resolve(target);
        if (fs[dir]?.type !== 'dir') {
          say(`ls: cannot access '${target}': No such file or directory`, 'err');
          break;
        }
        let items = children(dir);
        if (!flags.includes('a')) items = items.filter(i => !i.startsWith('.'));
        else items = ['.', '..', ...items];
        if (flags.includes('l')) {
          say(`total ${items.length}`);
          items.forEach(i => {
            const node = fs[`${dir}/${i}`] || { type: 'dir' };
            const perm = node.type === 'dir' ? 'drwxr-xr-x' : node.perm;
            const size = node.type === 'dir' ? 4096 : (node.body || '').length;
            say(`${perm} 1 student student ${String(size).padStart(5)} Oct 21 09:30 ${i}`, node.type === 'dir' ? 'dir' : 'o');
          });
        } else say(items.join('   ') || '(empty)');
        break;
      }
      case 'cd': {
        const dir = resolve(target);
        if (fs[dir]?.type === 'dir') nextCwd = dir;
        else say(`cd: ${target}: No such file or directory`, 'err');
        break;
      }
      case 'cat': {
        const f = fs[resolve(target)];
        if (!target) say('cat: which file? Try: cat notes.txt', 'err');
        else if (!f) say(`cat: ${target}: No such file or directory`, 'err');
        else if (f.type === 'dir') say(`cat: ${target}: Is a directory`, 'err');
        else say(f.body || '');
        break;
      }
      case 'mkdir':
      case 'touch': {
        if (!target) {
          say(`${name}: missing name`, 'err');
          break;
        }
        const p = resolve(target);
        if (fs[p]) {
          if (name === 'mkdir') say(`mkdir: cannot create directory '${target}': File exists`, 'err');
          break;
        }
        nextFs = { ...fs, [p]: name === 'mkdir' ? { type: 'dir' } : { type: 'file', perm: '-rw-r--r--', body: '' } };
        break;
      }
      case 'echo': {
        const m = cmd.match(/^echo\s+(.*?)\s*(>>?)\s*(\S+)$/);
        if (m) {
          const p = resolve(m[3]);
          const text = m[1].replace(/^["']|["']$/g, '');
          const prev = fs[p]?.body || '';
          nextFs = { ...fs, [p]: { type: 'file', perm: '-rw-r--r--', body: m[2] === '>>' && prev ? `${prev}\n${text}` : text } };
        } else say(args.join(' ').replace(/^["']|["']$/g, ''));
        break;
      }
      case 'chmod': {
        const file = args[1] && resolve(args[1]);
        if (args[0] === '+x' && fs[file]?.type === 'file') nextFs = { ...fs, [file]: { ...fs[file], perm: '-rwxr-xr-x' } };
        else say('chmod: try  chmod +x hello.sh  (from inside projects)', 'err');
        break;
      }
      case 'rm': {
        const p = resolve(target);
        if (fs[p]?.type === 'file') {
          nextFs = { ...fs };
          delete nextFs[p];
          say(`removed '${target}'. Linux has no recycle bin: it is gone for good.`, 'hint');
        } else say(`rm: cannot remove '${target}': No such file`, 'err');
        break;
      }
      case 'sudo':
        say('[sudo] password for student: ********', 'o');
        say('This is a simulator, so no root here. On your real VM, sudo runs a command as the administrator. With great power comes great responsibility.', 'hint');
        break;
      case 'ip':
        say('1: lo: <LOOPBACK,UP> inet 127.0.0.1/8\n2: eth0: <BROADCAST,UP> inet 192.168.56.101/24 brd 192.168.56.255');
        break;
      case 'date':
        say(new Date().toString());
        break;
      case 'uname':
        say(flags.includes('a') ? 'Linux voltide 6.8.0-kali-amd64 #1 SMP x86_64 GNU/Linux' : 'Linux');
        break;
      case 'history':
        say(hist.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`).join('\n') || '(no history yet)');
        break;
      case 'man':
        say(MAN[target] || `No manual entry for ${target || '?'}. Try: man ls`);
        break;
      case 'clear':
        setLines([]);
        setHist(h => [...h, cmd]);
        return;
      default:
        if (name.startsWith('./')) {
          const f = fs[resolve(name)];
          if (!f) say(`bash: ${name}: No such file or directory`, 'err');
          else if (!f.perm.includes('x')) say(`bash: ${name}: Permission denied. Hint: chmod +x ${name.slice(2)}`, 'err');
          else say('Hello from your first script!');
        } else say(`${name}: command not found. Type help to see commands.`, 'err');
    }
    const hit = MISSIONS.findIndex((m, i) => !done.has(i) && m[2](cmd) && !out.some(o => o.t === 'err'));
    if (hit >= 0) {
      setDone(new Set(done).add(hit));
      award(`terminal:${hit}`, 15, `Mission ${hit + 1}: ${MISSIONS[hit][1]}`);
      say(`✔ Mission complete: ${MISSIONS[hit][1]}`, 'hint');
      burst(inputRef.current);
    }
    setFs(nextFs);
    setCwd(nextCwd);
    setLines(l => [...l, ...out]);
    if (cmd) setHist(h => [...h, cmd]);
  };

  const onKey = e => {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
      setHIdx(-1);
    } else if (e.key === 'ArrowUp' && hist.length) {
      e.preventDefault();
      const i = hIdx < 0 ? hist.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(i);
      setInput(hist[i]);
    } else if (e.key === 'ArrowDown' && hIdx >= 0) {
      e.preventDefault();
      const i = hIdx + 1;
      setHIdx(i >= hist.length ? -1 : i);
      setInput(i >= hist.length ? '' : hist[i]);
    }
  };

  return (
    <div className="split-2-1">
      <div className="term-sim" onClick={() => inputRef.current?.focus()}>
        <div className="term-sim__screen" ref={screen} aria-live="polite">
          {lines.map((l, i) => (
            <div key={i} className={l.t === 'p' ? 'p' : l.t}>
              {l.s}
            </div>
          ))}
        </div>
        <div className="term-sim__input">
          <span>student@voltide:{short(cwd)}$</span>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey} aria-label="Terminal command" autoCapitalize="off" autoComplete="off" spellCheck="false" />
        </div>
      </div>
      <div className="d-panel">
        <span className="d-label">Missions · {done.size}/{MISSIONS.length}</span>
        <ol className="missions">
          {MISSIONS.map(([hint, text], i) => (
            <li key={i} className={done.has(i) ? 'done' : ''}>
              <span>{done.has(i) ? '✔' : `${i + 1}.`}</span>
              <span>
                {text} <br />
                <code>{hint}</code>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
