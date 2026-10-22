import { useEffect, useRef, useState } from 'react';
import { award, badge } from '../../../src/lib/game.js';
import { useSpark } from '../../../src/components/Spark.jsx';

// A safe network-commands playground with realistic sample output, in Linux
// (your Ubuntu VM) or Windows (lab PCs) flavour.
const OUT = {
  ping: `PING google.com (142.250.183.46) 56(84) bytes of data.
64 bytes from bom12s08-in-f14.1e100.net: icmp_seq=1 ttl=117 time=11.8 ms
64 bytes from bom12s08-in-f14.1e100.net: icmp_seq=2 ttl=117 time=12.1 ms
64 bytes from bom12s08-in-f14.1e100.net: icmp_seq=3 ttl=117 time=11.6 ms
64 bytes from bom12s08-in-f14.1e100.net: icmp_seq=4 ttl=117 time=12.4 ms
--- google.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3005ms
→ The server answered 4 times in ~12 ms. Your network works.`,
  ipaddr: `1: lo: <LOOPBACK,UP> inet 127.0.0.1/8 scope host lo
2: enp0s3: <BROADCAST,MULTICAST,UP> mtu 1500
    link/ether 08:00:27:5a:1c:9e
    inet 10.0.2.15/24 brd 10.0.2.255 scope global dynamic enp0s3
→ 10.0.2.15 is your VM's PRIVATE address. 08:00:27:… is its MAC address.`,
  ipconfig: `Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.5
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1
→ Private address 192.168.1.5; the router (gateway) is 192.168.1.1.`,
  route: `default via 10.0.2.2 dev enp0s3 proto dhcp metric 100
10.0.2.0/24 dev enp0s3 proto kernel scope link src 10.0.2.15
→ "default via 10.0.2.2": anything not local goes to the gateway.`,
  nslookup: `Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
Name:	google.com
Address: 142.250.183.46
→ DNS turned the name google.com into an IP address.`,
  curl: `HTTP/2 200
content-type: text/html; charset=UTF-8
server: ECS (bom/7A8C)
cache-control: max-age=604800
→ 200 = success. -I shows only the headers, not the whole page.`,
  traceroute: `traceroute to google.com (142.250.183.46), 30 hops max
 1  _gateway (10.0.2.2)          0.4 ms
 2  192.168.1.1 (home router)    2.1 ms
 3  10.120.0.1 (ISP)             6.8 ms
 4  103.21.244.13 (ISP core)     8.9 ms
 5  72.14.195.40 (Google edge)  10.7 ms
 6  142.250.183.46              11.9 ms
→ Each line is one router (hop) your packets passed through.`
};

const LINUX = { 'ping -c 4 google.com': 'ping', 'ip addr': 'ipaddr', 'ip a': 'ipaddr', 'ip route': 'route', 'nslookup google.com': 'nslookup', 'curl -I https://example.com': 'curl', 'traceroute google.com': 'traceroute' };
const WIN = { 'ping google.com': 'ping', ipconfig: 'ipconfig', 'route print': 'route', 'nslookup google.com': 'nslookup', 'curl -I https://example.com': 'curl', 'tracert google.com': 'traceroute' };
const MISSIONS = [
  ['ping', 'Check a server is alive'],
  ['ipaddr', 'Find your own IP address'],
  ['route', 'Find your default gateway'],
  ['nslookup', 'Turn a name into an IP (DNS)'],
  ['curl', 'Fetch a website’s HTTP headers'],
  ['traceroute', 'Trace the route to a server']
];

export default function NetTerminal() {
  const [os, setOs] = useState('linux');
  const [lines, setLines] = useState([{ t: 'hint', s: 'Network lab (safe simulator). Type a command or click one of the suggestions below.' }]);
  const [input, setInput] = useState('');
  const [done, setDone] = useState(() => new Set());
  const screen = useRef(null);
  const inputRef = useRef(null);
  const burst = useSpark();
  const table = os === 'linux' ? LINUX : WIN;
  const prompt = os === 'linux' ? 'student@ubuntu:~$' : 'C:\\Users\\student>';
  useEffect(() => {
    screen.current.scrollTop = screen.current.scrollHeight;
  }, [lines]);
  useEffect(() => {
    if (done.size === MISSIONS.length && award('demo:netterm', 150, 'Every network command run')) badge('net-ninja');
  }, [done]);
  const run = raw => {
    const cmd = raw.trim();
    if (!cmd) return;
    const key = table[cmd] || (cmd === 'ipconfig' && os === 'linux' ? 'wrong-os' : null) || (cmd.startsWith('ip ') && os === 'windows' ? 'wrong-os' : null);
    const out = [{ t: 'p', s: `${prompt} ${cmd}` }];
    if (cmd === 'clear' || cmd === 'cls') return setLines([]);
    if (key === 'wrong-os') out.push({ t: 'err', s: `That's a ${os === 'linux' ? 'Windows' : 'Linux'} command. Switch the OS toggle above, or use the ${os === 'linux' ? 'Linux' : 'Windows'} version.` });
    else if (key) {
      out.push({ t: 'o', s: OUT[key] });
      if (!done.has(key)) {
        setDone(new Set(done).add(key));
        award(`netterm:${key}`, 15, `Command mastered: ${cmd.split(' ')[0]}`);
        burst(inputRef.current);
      }
    } else out.push({ t: 'err', s: `Try one of: ${Object.keys(table).join(' · ')}` });
    setLines(l => [...l, ...out]);
  };
  return (
    <div className="split-2-1">
      <div>
        <div className="seg" style={{ marginBottom: 10 }}>
          <button type="button" aria-pressed={os === 'linux'} onClick={() => setOs('linux')}>Linux (Ubuntu VM)</button>
          <button type="button" aria-pressed={os === 'windows'} onClick={() => setOs('windows')}>Windows (lab PC)</button>
        </div>
        <div className="term-sim" onClick={() => inputRef.current?.focus()}>
          <div className="term-sim__screen" ref={screen} aria-live="polite">
            {lines.map((l, i) => <div key={i} className={l.t}>{l.s}</div>)}
          </div>
          <div className="term-sim__input">
            <span>{prompt}</span>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { run(input); setInput(''); } }} aria-label="Network command" autoCapitalize="off" autoComplete="off" spellCheck="false" />
          </div>
        </div>
        <div className="d-row" style={{ marginTop: 10 }}>
          {Object.keys(table).filter(c => c !== 'ip a').map(c => (
            <button key={c} type="button" className="btn btn--sm btn--ghost" onClick={() => run(c)}><code>{c}</code></button>
          ))}
        </div>
      </div>
      <div className="d-panel">
        <span className="d-label">Missions · {done.size}/{MISSIONS.length}</span>
        <ol className="missions">
          {MISSIONS.map(([k, text], i) => (
            <li key={k} className={done.has(k) ? 'done' : ''}>
              <span>{done.has(k) ? '✔' : `${i + 1}.`}</span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
