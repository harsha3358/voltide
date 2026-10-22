// EPISODE 04 · SURGE: Cloud Deployment Challenge
// Topics follow Day 2, Session 04 of the Cloud Computing Workshop plan:
// teams deploy a simple website on a cloud VM, test it, secure it,
// troubleshoot it, demo it live, and then clean everything up.
import TeamBuilder from './demos/TeamBuilder.jsx';
import PageBuilder from './demos/PageBuilder.jsx';
import DeployPipeline from './visuals/DeployPipeline.jsx';
import TroubleTree from './demos/TroubleTree.jsx';
import RequestPath3D from './visuals/RequestPath3D.jsx';
import ConfigReview from './demos/ConfigReview.jsx';
import LogDetective from './demos/LogDetective.jsx';
import DemoTimer from './demos/DemoTimer.jsx';
import CleanupChecklist from './demos/CleanupChecklist.jsx';

export default {
  episode: {
    title: 'LAGZILLA: Final Form',
    lines: [
      '> This is it. LAGZILLA’s final form.',
      '> It feeds on sites that never ship and servers left running.',
      '> Your squad has one mission: put a real website on the internet.',
      '> Deploy it. Test it. Secure it. Demo it live.',
      '> Then stop what you started, and LAGZILLA starves.'
    ],
    reward: '8 missions · 6 badges · 1 final boss · 1 secret message · 1 graduate certificate'
  },
  transmission: 'STOP WHAT YOU START',
  boss: {
    name: 'FINAL FORM',
    taunt: 'LAGZILLA’s Final Form says freshers can’t deploy. Your site is live. Prove the rest.',
    win: 'LAGZILLA is defeated. You deployed a real website, secured it, debugged it and cleaned up. That’s the whole workshop. Go claim your Workshop Graduate certificate on your profile.',
    questions: [
      { q: 'On Ubuntu, nginx serves files from which folder by default?', options: ['`/var/www/html`', '`/home/ubuntu/Desktop`', '`C:\\inetpub`'], answer: 0 },
      { q: 'Which command copies `index.html` from your laptop to the server?', options: ['`scp -i key.pem index.html ubuntu@IP:~`', '`ping index.html`', '`gcc index.html`'], answer: 0 },
      { q: 'The site opens for you but not for anyone else. The HTTP rule’s source is probably…', options: ['Anywhere (0.0.0.0/0)', 'My IP', 'Port 443'], answer: 1 },
      { q: 'A friend’s phone can’t open your site because it auto-tried…', options: ['`https://` (you have no certificate yet)', '`ftp://`', 'Bluetooth'], answer: 0 },
      { q: 'Which command checks whether nginx is running?', options: ['`sudo systemctl status nginx`', '`free -h`', '`nproc`'], answer: 0 },
      { q: 'Before restarting nginx after editing its config, run…', options: ['`sudo nginx -t`', '`sudo rm -rf /`', '`sudo reboot`'], answer: 0 },
      { q: 'You stopped and started your instance. The site broke. Why?', options: ['The public IP changed', 'nginx was deleted', 'The disk got smaller'], answer: 0 },
      { q: 'After the workshop, what do you do with the EC2 instance?', options: ['Terminate it (and check billing)', 'Leave it running forever', 'Share the key with friends'], answer: 0 }
    ]
  },
  intro:
    'Episode 04, the final boss of the workshop. Your **squad** builds a webpage, deploys it on an **EC2** server with **nginx**, makes it open on anyone’s phone, locks it down, reads the logs when it breaks (it will), and demos it live. Then you clean up every resource, because the cloud bills like a taxi meter.',
  outcomes: [
    'Work as a team with clear roles',
    'Build a simple webpage and deploy it on a cloud VM with nginx',
    'Make the site reachable publicly and test it from a phone',
    'Review and tighten a deployment’s security',
    'Troubleshoot with `systemctl`, nginx logs and `journalctl`',
    'Present a working cloud deployment in a 3-minute live demo',
    'Shut down and delete every resource you created'
  ],
  topics: [
    {
      id: 'teams',
      hook: 'Every real deployment is a team sport. Yes, even the one where “the backend guy” disappears.',
      short: 'Form your squad',
      kicker: 'Team up',
      title: 'Form a squad and pick roles',
      lead: 'Teams of three or four. Everyone gets a job, and everyone types at least one command today.',
      plain: 'Pick a **team name** and four roles: **Builder** (the page), **Deployer** (the server), **Tester** (phones and bugs) and **Presenter** (the demo). Roles can rotate, but someone owns each one.',
      analogy: {
        type: 'electric',
        text: 'A power grid: one plant generates, one line transmits, one substation checks the voltage, one switch delivers it to homes. If any one fails, the lights go out.'
      },
      jargon: [
        ['Owner', 'the person responsible for a task getting done.'],
        ['Hand-off', 'passing work to the next person, with notes.'],
        ['Runbook', 'a written list of steps anyone on the team can follow.'],
        ['Stand-up', 'a 1-minute check-in: done, doing, blocked.']
      ],
      demo: { id: 'demo-team', title: 'SQUAD BUILDER', hint: 'fill 4 roles', intro: 'Name your squad and assign a person to each role. The card saves in this browser.', el: <TeamBuilder /> },
      points: [
        'Share one AWS account per team (the facilitator’s or one student’s), so only one instance is running.',
        'The **Deployer** keeps the `.pem` key. Do **not** post it in group chats.',
        'Write commands you run in a shared note: that’s your runbook for the demo.'
      ],
      check: {
        q: 'Who should keep the team’s `.pem` key file?',
        options: ['Posted in the WhatsApp group for everyone', 'The Deployer only, on their laptop', 'Uploaded to a public GitHub repo', 'Printed on the classroom board'],
        answer: 1,
        explain: 'Whoever has the key can log in to the server. Keep it with one person and never paste it anywhere public.'
      }
    },
    {
      id: 'build-page',
      hook: 'You don’t need React, Next.js or a ₹40k course. One HTML file is a website.',
      short: 'Build the page',
      kicker: 'Create',
      title: 'Build your team webpage',
      lead: 'A single `index.html` with your team name, members and a line about how it’s hosted. That’s the whole site.',
      plain: '**HTML** describes the content (headings, paragraphs). **CSS** describes the look (colours, spacing). Both go in one file today, called `index.html`.',
      analogy: {
        type: 'water',
        text: 'HTML is the pipe layout of a fountain; CSS is the lighting and colour that make people stop and stare.'
      },
      jargon: [
        ['HTML tag', 'a label like `<h1>` (big heading) or `<p>` (paragraph).'],
        ['CSS', 'style rules, e.g. `body { background: #0b1020; }`.'],
        ['index.html', 'the default file a web server shows for a folder.'],
        ['viewport meta', 'the line that makes the page fit phone screens.']
      ],
      demo: { id: 'demo-page', title: 'PAGE BUILDER', hint: 'live preview', intro: 'Edit the fields and watch the page update. Then copy or download the HTML: that’s the file you’ll deploy.', el: <PageBuilder /> },
      after: ['Want to change more? Edit the downloaded file in any text editor, like [VS Code](https://code.visualstudio.com/). Open it in your browser to preview before deploying. MDN’s [HTML basics](https://developer.mozilla.org/en-US/docs/Learn_web_development) is the best free reference.'],
      check: {
        q: 'Why must the file be named `index.html`?',
        options: ['It looks professional', 'Web servers show index.html by default when someone opens the site', 'AWS requires it for billing', 'Browsers can’t open other names'],
        answer: 1,
        explain: 'When you visit `http://IP/`, nginx looks for `index.html` in its folder and serves it.'
      }
    },
    {
      id: 'deploy',
      hook: 'This is the moment. Your file leaves your laptop and lives on the internet.',
      short: 'Deploy with nginx',
      kicker: 'Ship it',
      title: 'Deploy the site on EC2 with nginx',
      lead: 'Launch a server, install a web server program, copy your file in. Three moves.',
      plain: '**nginx** is a web server: it listens on port **80** and sends files to browsers. Install it on your EC2 instance, then replace its default page with your `index.html`.',
      analogy: {
        type: 'electric',
        text: 'The EC2 instance is the building with power. nginx is the shopkeeper who stands at the door (port 80) and hands out your page to every visitor.'
      },
      jargon: [
        ['nginx', 'a fast, popular web server (say “engine-x”).'],
        ['scp', '“secure copy”: copies files over SSH.'],
        ['/var/www/html', 'the folder nginx serves on Ubuntu.'],
        ['systemctl', 'starts, stops and checks services like nginx.']
      ],
      visual: { caption: 'From your laptop to the whole internet', note: 'press deploy', el: <DeployPipeline /> },
      lab: {
        id: 'lab-deploy',
        title: 'Deploy your team site',
        goal: 'The **Deployer** drives, everyone watches and copies the commands into the runbook. Use the [EC2 console](https://console.aws.amazon.com/ec2/).',
        steps: [
          { do: 'Launch an **Ubuntu 24.04**, **t3.micro** instance (same as Episode 03). Security group: **SSH from My IP**, **HTTP from Anywhere**. Copy its public IP.' },
          { do: 'SSH in and install nginx:', cmd: 'ssh -i mykey.pem ubuntu@<public-ip>\nsudo apt update\nsudo apt install -y nginx\nsystemctl status nginx', out: '● nginx.service - A high performance web server and a reverse proxy server\n     Active: active (running)' },
          { do: 'Open `http://<public-ip>` in a browser. You should see **“Welcome to nginx!”**. The server works.' },
          { do: 'From your **laptop** (a new terminal, in the folder with your file), copy the page up:', cmd: 'scp -i mykey.pem index.html ubuntu@<public-ip>:~', out: 'index.html                     100% 1432    48.2KB/s   00:00' },
          { do: 'Back on the **server**, move it into nginx’s folder:', cmd: 'sudo mv ~/index.html /var/www/html/index.html\nsudo chmod 644 /var/www/html/index.html', out: '' },
          { do: 'Refresh the browser. Your team page is live on the internet. 🎉 (No laptop file? Run `sudo nano /var/www/html/index.html` on the server and paste the HTML.)' }
        ],
        safety: 'Only open **SSH to My IP**. The website (port 80) is the only thing the whole world needs. Reference: [nginx beginner’s guide](https://nginx.org/en/docs/beginners_guide.html).'
      },
      links: [
        { href: 'https://console.aws.amazon.com/ec2/', label: 'EC2 console' },
        { href: 'https://ubuntu.com/tutorials/install-and-configure-nginx', label: 'Ubuntu: install nginx' }
      ],
      check: {
        q: 'You open the IP and see **“Welcome to nginx!”** instead of your page. What happened?',
        options: ['nginx is broken', 'Your index.html isn’t in /var/www/html yet', 'The security group blocks you', 'DNS failed'],
        answer: 1,
        explain: 'nginx is working (you can see its page), it just doesn’t have your file yet. Move it into `/var/www/html/`.'
      }
    },
    {
      id: 'test-access',
      hook: '“It works on my machine” is not a deployment. It works on a stranger’s phone on mobile data? Now we’re talking.',
      short: 'Test public access',
      kicker: 'Test',
      title: 'Test it from everywhere',
      lead: 'The **Tester** tries every device and network, and the team fixes what breaks.',
      plain: 'Test from the server itself (`curl localhost`), from your laptop, and from a phone on **mobile data** (not the same Wi-Fi). Type `http://` explicitly: your site has no HTTPS certificate yet.',
      analogy: {
        type: 'water',
        text: 'Testing a new pipe: check at the pump (server), at the first tap (laptop), then at the farthest house in town (phone on 4G). Water at the pump means nothing if the far tap is dry.'
      },
      jargon: [
        ['localhost', 'the machine you’re on: `127.0.0.1`.'],
        ['curl -I', 'shows just the HTTP status line and headers.'],
        ['Timeout', 'no reply at all: usually a firewall rule.'],
        ['Connection refused', 'reached the server, but nothing listens on that port.']
      ],
      visual: { caption: 'Layer by layer: follow the request', note: 'break a layer, then send', el: <RequestPath3D /> },
      demo: { id: 'demo-trouble', title: 'WHY CAN’T MY FRIEND OPEN IT?', hint: 'find the cause', intro: 'The most common deployment mystery, as a decision tree. Walk it like an engineer: one check at a time.', el: <TroubleTree /> },
      lab: {
        id: 'lab-test',
        title: 'Three-point test',
        goal: 'Every team member opens the site on their own phone.',
        steps: [
          { do: 'On the **server**:', cmd: 'curl -I http://localhost', out: 'HTTP/1.1 200 OK\nServer: nginx/1.24.0 (Ubuntu)' },
          { do: 'On your **laptop**:', cmd: 'curl -I http://<public-ip>', out: 'HTTP/1.1 200 OK' },
          { do: 'On a **phone with Wi-Fi off**, type `http://<public-ip>` in the browser. Screenshot it working, you’ll use it in the demo.' }
        ]
      },
      check: {
        q: '`curl -I http://localhost` works on the server, but your laptop gets a **timeout**. Most likely cause?',
        options: ['nginx crashed', 'The security group doesn’t allow port 80 from your network', 'The HTML has a typo', 'Your laptop is too old'],
        answer: 1,
        explain: 'The server answers itself fine, so nginx is OK. A timeout from outside means a firewall is dropping the traffic.'
      }
    },
    {
      id: 'secure-it',
      hook: 'Bots scan every new IP on the internet within minutes. Yours included. Let’s make them bored.',
      short: 'Secure it',
      kicker: 'Lock down',
      title: 'Secure your deployment',
      lead: 'A five-minute review that prevents most real-world cloud disasters.',
      plain: 'Keep **only** ports 80/443 open to everyone and **22 to My IP**. Turn on **ufw**, install updates, protect the key, use an IAM user with **MFA**, and set a **billing alert**.',
      analogy: {
        type: 'electric',
        text: 'Safety gear for an electrician: insulated gloves (least privilege), a breaker (firewall), a voltage tester (billing alert). Boring until the day it saves you.'
      },
      jargon: [
        ['Attack surface', 'everything an attacker could poke. Fewer open ports = smaller.'],
        ['Patch', 'a security fix, installed with `apt upgrade`.'],
        ['MFA', 'a second login step (an app code) on top of the password.'],
        ['HTTPS / TLS', 'encryption. Needs a domain and a certificate, e.g. free from Let’s Encrypt.']
      ],
      demo: { id: 'demo-review', title: 'SECURITY REVIEW', hint: '8 settings', intro: 'Your teammate’s deployment. Mark every setting safe or risky.', el: <ConfigReview /> },
      lab: {
        id: 'lab-secure',
        title: 'Harden the server',
        goal: 'On your **EC2 instance**.',
        steps: [
          { do: 'Install security updates:', cmd: 'sudo apt update && sudo apt upgrade -y' },
          { do: 'Turn on the firewall (SSH **first**, so you don’t lock yourself out):', cmd: "sudo ufw allow OpenSSH\nsudo ufw allow 'Nginx Full'\nsudo ufw enable\nsudo ufw status", out: 'Status: active\nOpenSSH                    ALLOW       Anywhere\nNginx Full                 ALLOW       Anywhere' },
          { do: 'In the console, re-check the security group: SSH = My IP, HTTP = Anywhere, nothing else.' },
          { do: 'Create a **zero-spend budget** in [AWS Budgets](https://console.aws.amazon.com/billing/home#/budgets) so AWS emails you if anything starts costing money.' }
        ],
        safety: 'HTTPS needs a domain name pointing at your IP, then a free certificate from [Let’s Encrypt](https://letsencrypt.org/) using [Certbot](https://certbot.eff.org/). It’s a great stretch goal, not required today.'
      },
      links: [
        { href: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html', label: 'Turn on MFA' },
        { href: 'https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html', label: 'AWS Budgets guide' }
      ],
      check: {
        q: 'Which is the **riskiest** setting?',
        options: ['HTTP (80) from Anywhere', 'All traffic from 0.0.0.0/0', 'ufw enabled', 'A billing alert at ₹100'],
        answer: 1,
        explain: '“All traffic from anywhere” removes the firewall entirely. The website port is meant to be public; everything else isn’t.'
      }
    },
    {
      id: 'logs-troubleshoot',
      hook: 'Servers don’t ghost you. They write down exactly what went wrong. You just have to read it.',
      short: 'Logs & troubleshooting',
      kicker: 'Debug',
      title: 'Read logs and troubleshoot',
      lead: 'When something breaks, don’t guess. Check the service, read the log, find the line.',
      plain: '`systemctl status` says if a service runs. nginx writes every visit to **access.log** and every problem to **error.log**. `journalctl` shows the system’s own log for a service.',
      analogy: {
        type: 'water',
        text: 'A water meter (access log) records every litre that flowed. A leak sensor (error log) records exactly where it dripped. Plumbers read both before touching a pipe.'
      },
      jargon: [
        ['access.log', '`/var/log/nginx/access.log`: one line per request, with the status code.'],
        ['error.log', '`/var/log/nginx/error.log`: what went wrong and where.'],
        ['tail -f', 'shows the end of a file and keeps updating, live.'],
        ['journalctl -u', 'shows the system log for one service (unit).'],
        ['nginx -t', 'tests the nginx config before you restart.']
      ],
      demo: { id: 'demo-logs', title: 'LOG DETECTIVE', hint: '3 cases', intro: 'Three real-looking incidents. Click the one log line that explains each.', el: <LogDetective /> },
      lab: {
        id: 'lab-logs',
        title: 'Watch your own logs live',
        goal: 'On the server. Have a teammate open the site on their phone while you watch.',
        steps: [
          { do: 'Is nginx healthy?', cmd: 'sudo systemctl status nginx', out: 'Active: active (running) since …' },
          { do: 'Watch requests arrive live (Ctrl + C to stop). Ask a teammate to refresh the site:', cmd: 'sudo tail -f /var/log/nginx/access.log', out: '106.51.8.20 - - [22/Oct/2026:11:02:40 +0530] "GET / HTTP/1.1" 200 1432 "-" "Mozilla/5.0 (Android)"' },
          { do: 'Ask them to open a page that doesn’t exist, like `/oops`. Spot the 404. Then check the error log and the system log:', cmd: 'sudo tail -n 20 /var/log/nginx/error.log\nsudo journalctl -u nginx --since "30 min ago"' },
          { do: 'The safe restart routine after any config change:', cmd: 'sudo nginx -t\nsudo systemctl restart nginx', out: 'nginx: configuration file /etc/nginx/nginx.conf test is successful' }
        ]
      },
      links: [{ href: 'https://nginx.org/en/docs/', label: 'nginx docs' }],
      check: {
        q: 'Your access log shows `"GET /Index.html HTTP/1.1" 404`. What’s wrong?',
        options: ['The server is out of memory', 'The file name’s case doesn’t match (index.html)', 'DNS is down', 'Port 22 is closed'],
        answer: 1,
        explain: 'Linux file names are case-sensitive. `Index.html` and `index.html` are different files.'
      }
    },
    {
      id: 'live-demo',
      hook: 'Three minutes. One phone. A live website. This is the part you’ll screenshot for LinkedIn.',
      short: 'Live demo',
      kicker: 'Show time',
      title: 'Present your live demo',
      lead: 'Every team gets three minutes. Show it working live, explain how, and share one thing that broke.',
      plain: 'Open the site **live on a phone**, explain the path (**EC2 → security group → nginx → file**), show **one command**, and tell the story of **one bug** you fixed. The **Presenter** runs the timer.',
      analogy: {
        type: 'electric',
        text: 'Flipping the switch at a stadium opening. Everyone has seen lights before; what impresses them is that you wired them.'
      },
      points: [
        '**Works live (40%)**: the site opens on a phone during the demo.',
        '**Explains the path (30%)**: can say what EC2, the security group and nginx each do.',
        '**Security (15%)**: SSH limited to My IP, only needed ports open.',
        '**Story (15%)**: one real problem and how the team solved it.'
      ],
      demo: { id: 'demo-timer', title: 'DEMO TIMER', hint: '3 minutes', intro: 'Rehearse once with the timer. Press Next when you finish each beat. Finish all four for the badge.', el: <DemoTimer /> },
      check: {
        q: 'Mid-demo, the site doesn’t load on the phone. Best move?',
        options: ['Panic and end the demo', 'Calmly check: http:// typed? IP correct? Then show your screenshot backup', 'Blame the facilitator', 'Restart the instance (new IP!)'],
        answer: 1,
        explain: 'Debugging live, calmly, is a great demo. Restarting the instance would change the public IP and make it worse.'
      }
    },
    {
      id: 'cleanup',
      hook: 'The Episode 01 golden rule, one last time: stop what you start. Future you, checking the bank balance, says thanks.',
      short: 'Clean up',
      kicker: 'Shut down',
      title: 'Clean up every resource',
      lead: 'A deployment isn’t finished until it’s safely shut down. Delete everything you created across Episodes 03 and 04.',
      plain: '**Terminate** instances, release **Elastic IPs**, delete leftover **volumes**, **buckets** and **functions**, disable **App Engine**, and check the **billing dashboard**.',
      analogy: {
        type: 'water',
        text: 'Leaving a cloud server running is leaving a tap open in an empty flat. Nobody’s using it. The meter still runs.'
      },
      jargon: [
        ['Stop', 'pauses the instance. Disk is kept (and billed a little).'],
        ['Terminate', 'deletes the instance for good. Disk is deleted too (by default).'],
        ['Elastic IP', 'a fixed public IP. Billed whenever it exists.'],
        ['Orphaned resource', 'something you forgot about, still billing.']
      ],
      demo: { id: 'demo-cleanup', title: 'CLEAN SWEEP', hint: '8 items', intro: 'Every resource from the workshop, each with a direct link to the console page where you delete it. Tick only what you actually deleted.', el: <CleanupChecklist /> },
      after: ['Want to keep your site online for your portfolio? Free static hosts like [GitHub Pages](https://pages.github.com/) or [Vercel](https://vercel.com/) serve a single HTML file for free, without a server to forget about.'],
      links: [
        { href: 'https://console.aws.amazon.com/billing/home', label: 'AWS billing dashboard' },
        { href: 'https://console.cloud.google.com/billing', label: 'Google Cloud billing' }
      ],
      check: {
        q: 'You **stopped** (not terminated) your instance. Are you billed anything?',
        options: ['Nothing at all', 'Yes, a little, for the disk (EBS volume) it keeps', 'Double, as a penalty', 'Only on weekends'],
        answer: 1,
        explain: 'Stopping stops compute charges, but the EBS volume still exists. Terminate to delete it.'
      }
    }
  ],
  takeaway: {
    title: 'Surge complete. ⚡🌊',
    text: 'You did it: from “what is the cloud?” to a live website on a server you launched, secured, debugged and cleaned up. That’s exactly what the workshop set out to do, and LAGZILLA never stood a chance. Check your profile for the **Workshop Graduate** certificate.',
    checklist: [
      'Our team site opened live on a phone on mobile data',
      'SSH is limited to My IP; only web ports are public',
      'I read nginx access and error logs',
      'We presented a 3-minute live demo',
      'Every cloud resource is terminated or deleted, and billing shows ₹0'
    ]
  }
};
