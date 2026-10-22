// EPISODE 03 · TIDE: Cloud Lab Practicals
// Topics follow Day 2, Session 03 of the Cloud Computing Workshop plan:
// launch VMs, run programs, deploy a web app, and tour storage, access,
// serverless, big data, databases and chatbots.
import LaunchWizard from './demos/LaunchWizard.jsx';
import InstanceSizer from './demos/InstanceSizer.jsx';
import CPlayground from './demos/CPlayground.jsx';
import MiniWebApp from './demos/MiniWebApp.jsx';
import DeployRace from './demos/DeployRace.jsx';
import StorageTypes from './visuals/StorageTypes.jsx';
import AccessRules from './demos/AccessRules.jsx';
import MapReduceViz from './demos/MapReduceViz.jsx';
import ServerlessTrigger from './demos/ServerlessTrigger.jsx';
import DbCompare from './visuals/DbCompare.jsx';
import CampusBot from './demos/CampusBot.jsx';

export default {
  episode: {
    title: 'LAGZILLA: Out of Memory',
    lines: [
      '> LAGZILLA evolved. It now lives inside servers.',
      '> It eats RAM, fills disks and crashes apps at 2 AM.',
      '> Theory won’t save you this time. You need real machines.',
      '> Launch VMs. Compile code. Ship a web app to the cloud.',
      '> Build faster than it can crash you.'
    ],
    reward: '8 missions · 6 badges · 1 boss fight · 1 secret message'
  },
  transmission: 'IF YOU LAUNCH IT YOU OWN IT',
  boss: {
    name: 'OUT OF MEMORY',
    taunt: 'LAGZILLA’s Out of Memory form thinks you still need a teacher to start a server. Prove it wrong.',
    win: 'Memory freed, apps running. You launched, compiled, deployed and secured. Next: Episode 04 · SURGE, the deployment challenge.',
    questions: [
      { q: 'You want to SSH into a new EC2 instance. Before `ssh -i key.pem …` works, you must run…', options: ['`chmod 400 key.pem`', '`rm key.pem`', '`sudo reboot`'], answer: 0 },
      { q: 'Which instance type is **free-tier** friendly for practice?', options: ['`m5.4xlarge`', '`t3.micro`', '`p4d.24xlarge`'], answer: 1 },
      { q: 'Which command shows how much **RAM** is free?', options: ['`df -h`', '`free -h`', '`nproc`'], answer: 1 },
      { q: '`gcc hello.c -o hello` succeeded. How do you run the program?', options: ['`./hello`', '`run hello.c`', '`gcc ./hello`'], answer: 0 },
      { q: 'Your Flask app runs on port 5000 but nobody can open it. Most likely fix?', options: ['Buy a faster CPU', 'Bind to `0.0.0.0` and allow port 5000 in the security group', 'Rename `app.py`'], answer: 1 },
      { q: 'Google App Engine is an example of…', options: ['IaaS', 'PaaS', 'SaaS'], answer: 1 },
      { q: 'Photos and videos for a website are best stored in…', options: ['Object storage (S3)', 'The C drive of your laptop', 'An Excel sheet'], answer: 0 },
      { q: 'The **least privilege** rule says each user gets…', options: ['Admin, to save time', 'Only the access they need', 'No access at all'], answer: 1 }
    ]
  },
  intro:
    'Episode 03, where you stop talking about the cloud and start **using** it. You’ll launch a VM (locally and on AWS), check its CPU, RAM and disk, compile a C program, run a Python web app, deploy to a PaaS, and tour storage, access control, serverless, big data, databases and chatbots. LAGZILLA hates people who ship.',
  outcomes: [
    'Launch a VM in VirtualBox and an instance on AWS EC2, then connect with SSH',
    'Check a VM’s CPU, RAM, disk and OS with Linux commands',
    'Compile and run a C program on a cloud VM',
    'Run a Python (Flask) web app and open it from a browser',
    'Explain how a PaaS like Google App Engine deploys code for you',
    'Tell block, object and file storage apart, and apply least privilege',
    'Explain serverless, MapReduce, SQL vs NoSQL and how chatbots match intents'
  ],
  topics: [
    {
      id: 'launch-vm',
      hook: 'In Episode 01 you built a VM on your laptop. Now you rent one in a data centre, in about ninety clicks fewer than you fear.',
      short: 'Launch a VM',
      kicker: 'Compute',
      title: 'Launch a virtual machine, locally and on AWS',
      lead: 'Same idea twice: a computer inside a computer. Once on your laptop with VirtualBox, once in an AWS data centre with EC2.',
      plain: 'An **EC2 instance** is a virtual machine you rent from AWS. You choose an **AMI** (the OS image), an **instance type** (its size), a **key pair** (your login key) and a **security group** (its firewall).',
      analogy: {
        type: 'electric',
        text: 'Renting an EV from an app: pick the model (AMI), the battery size (instance type), get a digital key (key pair) and the car only opens for you (security group). Return it when done, or keep paying.'
      },
      jargon: [
        ['AMI', 'Amazon Machine Image: the OS template, e.g. Ubuntu Server 24.04.'],
        ['Instance type', 'the size: vCPUs + RAM, e.g. `t3.micro` (2 vCPU, 1 GB).'],
        ['Key pair', 'a `.pem` file that is your password for SSH. Lose it, lose access.'],
        ['Public IPv4', 'the address you SSH into and open in a browser.'],
        ['Region', 'where the data centre is. Use **Asia Pacific (Mumbai) ap-south-1** for low latency in India.']
      ],
      demo: { id: 'demo-launch', title: 'EC2 LAUNCH PRACTICE', hint: 'zero bill', intro: 'A practice copy of the AWS launch page. Fix every warning, then launch a perfect instance for a badge.', el: <LaunchWizard /> },
      lab: {
        id: 'lab-ec2',
        title: 'Clone your local VM, then launch a real EC2 instance',
        goal: 'First a quick local exercise, then the real thing in the [AWS EC2 console](https://console.aws.amazon.com/ec2/).',
        steps: [
          { do: 'In **VirtualBox**, right-click your Ubuntu VM → **Clone** → *Full clone*. You now have a second machine in seconds. That’s exactly what the cloud does with images.' },
          { do: 'Sign in to the [AWS console](https://console.aws.amazon.com/), switch region to **Mumbai (ap-south-1)**, open **EC2 → Launch instance**. Name it, pick **Ubuntu Server 24.04 LTS**, type **t3.micro** (or t2.micro if that’s the free-tier one shown).' },
          { do: 'Create a key pair (RSA, `.pem`) and download it. In network settings: **SSH from My IP**, tick **Allow HTTP**. Keep 8 GB storage. Press **Launch instance**.' },
          { do: 'Copy the instance’s **Public IPv4 address**. On your laptop terminal, lock the key file and connect:', cmd: 'chmod 400 mykey.pem\nssh -i mykey.pem ubuntu@<public-ip>', out: 'Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-1012-aws x86_64)\nubuntu@ip-172-31-20-4:~$' },
          { do: 'On Windows, use the same `ssh` command in PowerShell, or the **EC2 Instance Connect** button in the console (no key needed).' }
        ],
        safety: 'Free tier is free only within its limits. **Stop** the instance when you finish today (Instance state → Stop) and **terminate** it after Episode 04. AWS’s own walkthrough: [Get started with EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html).'
      },
      links: [
        { href: 'https://console.aws.amazon.com/ec2/', label: 'AWS EC2 console' },
        { href: 'https://aws.amazon.com/free/', label: 'AWS Free Tier' },
        { href: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-linux-inst-ssh.html', label: 'Connect with SSH' }
      ],
      check: {
        q: 'SSH says **“Permissions 0644 for mykey.pem are too open”**. What do you do?',
        options: ['Delete the instance', 'Run `chmod 400 mykey.pem` and try again', 'Open port 22 to the whole internet', 'Rename the file to key.txt'],
        answer: 1,
        explain: 'SSH refuses keys that other users could read. `chmod 400` makes it readable only by you.'
      }
    },
    {
      id: 'vm-resources',
      hook: 'You paid for 1 GB of RAM. Did you get it? Trust, but `free -h`.',
      short: 'Check VM resources',
      kicker: 'Inspect',
      title: 'Check your VM: OS, CPU, RAM and disk',
      lead: 'A good engineer’s first move on any new server: find out what it actually is.',
      plain: 'A handful of Linux commands tell you the **OS**, number of **CPUs**, free **memory** and free **disk**. `top` shows what is using them right now.',
      analogy: {
        type: 'water',
        text: 'Checking a water tank before a party: how big is it (disk), how fast does it fill (CPU), how much is in it right now (RAM)? Run out mid-party and the show stops.'
      },
      jargon: [
        ['vCPU', 'a virtual CPU core given to your VM.'],
        ['RAM', 'short-term memory. Run out and apps crash: “out of memory”.'],
        ['Disk / volume', 'long-term storage. On EC2 it’s an **EBS volume**.'],
        ['Load average', 'how busy the CPU has been (shown by `top` and `uptime`).'],
        ['Process', 'a running program, with its own ID (PID).']
      ],
      demo: { id: 'demo-sizer', title: 'INSTANCE SIZER', hint: 'pick a size', intro: 'Pick a workload and see which instance size makes sense, and what happens if you go too small or too big.', el: <InstanceSizer /> },
      lab: {
        id: 'lab-resources',
        title: 'Inspect your VM',
        goal: 'Run these on your **EC2 instance** (or your Ubuntu VM). Write down the answers, they appear in the boss fight.',
        steps: [
          { do: 'Kernel and OS:', cmd: 'uname -a\nlsb_release -a', out: 'Linux ip-172-31-20-4 6.8.0-1012-aws … x86_64 GNU/Linux\nDescription:\tUbuntu 24.04 LTS' },
          { do: 'How many CPUs, and what kind:', cmd: 'nproc\nlscpu | head -15', out: '2\nArchitecture:  x86_64\nModel name:    Intel(R) Xeon(R) Platinum 8259CL CPU @ 2.50GHz' },
          { do: 'Memory and disk:', cmd: 'free -h\ndf -h /', out: '               total   used   free\nMem:           914Mi   210Mi  480Mi\nFilesystem  Size  Used Avail Use% Mounted on\n/dev/root   7.6G  1.9G  5.7G  25% /' },
          { do: 'Live view of processes (press `q` to quit), and the machine’s name:', cmd: 'top\nhostnamectl' }
        ]
      },
      links: [{ href: 'https://aws.amazon.com/ec2/instance-types/', label: 'EC2 instance types' }],
      check: {
        q: '`df -h` shows **Use% 100%** on `/`. What is full?',
        options: ['RAM', 'The disk', 'The CPU', 'The internet'],
        answer: 1,
        explain: '`df` reports **disk** space. `free` is the one for RAM.'
      }
    },
    {
      id: 'c-program',
      hook: 'Your first-year C lab, except the computer is in Mumbai and you’re controlling it from a canteen.',
      short: 'Run a C program',
      kicker: 'Code',
      title: 'Compile and run a C program on a cloud VM',
      lead: 'Cloud servers are just computers. Anything you do in the C lab, you can do on them.',
      plain: 'Install the compiler (**gcc**), write `hello.c` in the **nano** editor, compile it into a program, then run it with `./hello`.',
      analogy: {
        type: 'electric',
        text: 'Source code is the circuit diagram. The compiler builds the actual circuit. `./hello` flips the switch.'
      },
      jargon: [
        ['gcc', 'the GNU C compiler.'],
        ['build-essential', 'Ubuntu’s package with gcc, make and friends.'],
        ['nano', 'a simple terminal text editor. Save: Ctrl + O, Enter. Exit: Ctrl + X.'],
        ['Executable', 'the compiled program file you can run.'],
        ['./', '“in this folder”. Linux won’t run local programs without it.']
      ],
      demo: { id: 'demo-c', title: 'C PLAYGROUND', hint: 'compile + run', intro: 'Edit the code, compile, and run. Try breaking it (remove a semicolon) to see a real-looking compiler error.', el: <CPlayground /> },
      lab: {
        id: 'lab-c',
        title: 'Hello from the cloud',
        goal: 'On your **EC2 instance**.',
        steps: [
          { do: 'Install the compiler:', cmd: 'sudo apt update\nsudo apt install -y build-essential\ngcc --version', out: 'gcc (Ubuntu 13.2.0-23ubuntu4) 13.2.0' },
          { do: 'Create the file, type the program, save with Ctrl + O, exit with Ctrl + X:', cmd: 'nano hello.c', out: '#include <stdio.h>\n\nint main(void) {\n    printf("Hello from the cloud!\\n");\n    return 0;\n}' },
          { do: 'Compile and run:', cmd: 'gcc hello.c -o hello\n./hello', out: 'Hello from the cloud!' },
          { do: 'Bonus: time it, then check the file type:', cmd: 'time ./hello\nfile hello', out: 'hello: ELF 64-bit LSB pie executable, x86-64 …' }
        ]
      },
      links: [{ href: 'https://gcc.gnu.org/onlinedocs/', label: 'GCC docs' }],
      check: {
        q: 'You type `hello` and get **“command not found”**, but the file exists. Fix?',
        options: ['Run `./hello`', 'Reinstall Ubuntu', 'Compile again with Word', 'Restart AWS'],
        answer: 0,
        explain: 'Linux only searches system folders for commands. `./hello` says “the one in this folder”.'
      }
    },
    {
      id: 'web-app',
      hook: 'Six lines of Python and your cloud VM becomes a website. Your seniors paid for a course to learn this.',
      short: 'Run a web app',
      kicker: 'Web',
      title: 'Run a Python web app on your VM',
      lead: 'A web app is just a program that waits for HTTP requests and answers them. Flask makes that tiny.',
      plain: '**Flask** is a small Python web framework. You define **routes** (URLs) and what each returns. Run it on `0.0.0.0:5000`, open port **5000** in the security group, visit `http://<public-ip>:5000`.',
      analogy: {
        type: 'water',
        text: 'Routes are taps on a wall: `/` gives the home page, `/about` gives about, and a tap that isn’t there gives a 404 puddle.'
      },
      jargon: [
        ['Flask', 'a lightweight Python web framework.'],
        ['Route', 'a URL path the app answers, like `/` or `/marks`.'],
        ['venv', 'a private Python environment for one project.'],
        ['0.0.0.0', '“listen on every network card”, so outsiders can reach it.'],
        ['Port 5000', 'Flask’s default port for development.']
      ],
      demo: { id: 'demo-webapp', title: 'MINI WEB APP', hint: 'visit every route', intro: 'The code on the left is a real Flask app. Use the fake browser to visit each route, including one that doesn’t exist.', el: <MiniWebApp /> },
      lab: {
        id: 'lab-flask',
        title: 'Ship a Flask app on EC2',
        goal: 'On your **EC2 instance**. Then open it from your phone.',
        steps: [
          { do: 'Install Python tools and create a project:', cmd: 'sudo apt install -y python3-venv python3-pip\nmkdir webapp && cd webapp\npython3 -m venv venv\nsource venv/bin/activate\npip install flask' },
          { do: 'Create `app.py` with `nano app.py`:', cmd: 'nano app.py', out: 'from flask import Flask\napp = Flask(__name__)\n\n@app.route("/")\ndef home():\n    return "<h1>Hello from my cloud VM 🚀</h1>"\n\nif __name__ == "__main__":\n    app.run(host="0.0.0.0", port=5000)' },
          { do: 'Run it:', cmd: 'python3 app.py', out: ' * Running on all addresses (0.0.0.0)\n * Running on http://172.31.20.4:5000' },
          { do: 'In the EC2 console: **Security → Security group → Edit inbound rules → Add rule**: Custom TCP, port **5000**, source **My IP**. Now open `http://<public-ip>:5000` in your browser. Ctrl + C stops the app.' }
        ],
        safety: 'This is Flask’s development server, fine for learning. Real sites put a proper web server like nginx in front, which you’ll do in Episode 04. Docs: [Flask quickstart](https://flask.palletsprojects.com/en/stable/quickstart/).'
      },
      check: {
        q: 'The app runs, but your browser times out on `http://<ip>:5000`. What do you check first?',
        options: ['The security group allows port 5000', 'Your Wi-Fi password', 'The C compiler', 'Your phone’s battery'],
        answer: 0,
        explain: 'A timeout usually means a firewall is silently dropping the traffic. Open 5000 in the security group.'
      }
    },
    {
      id: 'app-engine',
      hook: 'In the last mission you set up the server. With a PaaS you just hand over the code and say “you deal with it”.',
      short: 'Deploy with a PaaS',
      kicker: 'Platform',
      title: 'Deploy with a PaaS: Google App Engine',
      lead: 'Same web app, zero servers to manage. App Engine builds, runs and scales it for you.',
      plain: '**Google App Engine** is a **PaaS**. You add an `app.yaml` file saying which runtime you need, run `gcloud app deploy`, and Google gives you a live HTTPS URL.',
      analogy: {
        type: 'electric',
        text: 'IaaS is buying a generator and wiring your house. PaaS is plugging into the grid: you only care that the socket works.'
      },
      jargon: [
        ['gcloud', 'Google Cloud’s command-line tool. Already installed in Cloud Shell.'],
        ['app.yaml', 'the config file: runtime, scaling, and so on.'],
        ['Runtime', 'the language environment, e.g. `python312`.'],
        ['Cloud Shell', 'a free terminal in your browser, inside the Google Cloud console.'],
        ['Version', 'every deploy creates a new version you can roll back to.']
      ],
      demo: { id: 'demo-race', title: 'DEPLOY RACE', hint: 'IaaS vs PaaS', intro: 'Two teams deploy the same app. One builds the server first; one hands code to a PaaS. Start the race.', el: <DeployRace /> },
      lab: {
        id: 'lab-gae',
        title: 'Deploy to App Engine from Cloud Shell',
        goal: 'Open [Google Cloud Console](https://console.cloud.google.com/), create or pick a project, then click **Activate Cloud Shell** (the `>_` icon). Your facilitator may do this as a live demo, since App Engine needs billing enabled.',
        steps: [
          { do: 'Set up the project and create the App Engine app (pick region **asia-south1**):', cmd: 'gcloud init\ngcloud app create' },
          { do: 'Make three small files: `main.py` (same Flask code, but the variable must be called `app`), `requirements.txt` and `app.yaml`:', cmd: 'mkdir gae && cd gae\necho "Flask" > requirements.txt\necho "runtime: python312" > app.yaml\nnano main.py' },
          { do: 'Deploy and open it:', cmd: 'gcloud app deploy\ngcloud app browse', out: 'Deployed service [default] to [https://your-project.el.r.appspot.com]' }
        ],
        safety: 'When you’re done, open **App Engine → Settings → Disable application**, or shut the project down, so it can’t bill you later. Guide: [App Engine Python quickstart](https://cloud.google.com/appengine/docs/standard/python3/building-app).'
      },
      links: [
        { href: 'https://console.cloud.google.com/appengine', label: 'App Engine console' },
        { href: 'https://cloud.google.com/shell/docs', label: 'Cloud Shell docs' },
        { href: 'https://cloud.google.com/free', label: 'Google Cloud free tier' }
      ],
      check: {
        q: 'With App Engine, who installs Python, patches the OS and scales the servers?',
        options: ['You', 'Google', 'Your college IT', 'Nobody'],
        answer: 1,
        explain: 'That’s the PaaS deal: the provider manages the platform, you only bring the code.'
      }
    },
    {
      id: 'ec2-storage-access',
      hook: 'Where do your Instagram photos live? Not on a hard disk you can point at. Welcome to object storage.',
      short: 'Storage & access',
      kicker: 'Store + secure',
      title: 'Cloud storage and access management',
      lead: 'Three kinds of storage, one golden rule for access: give people only what they need.',
      plain: '**Block storage (EBS)** is a disk for one VM. **Object storage (S3)** stores files of any size, reachable by URL. **File storage (EFS)** is a shared folder for many VMs. **IAM** decides who may do what.',
      analogy: {
        type: 'water',
        text: 'EBS is the water tank on your own roof. S3 is the city reservoir: anyone with the right pipe (permission) can draw from it. EFS is the shared tank of a whole apartment block.'
      },
      jargon: [
        ['Bucket', 'an S3 container for objects. Names are globally unique.'],
        ['Object', 'a file plus its metadata, addressed by a key like `photos/fest.jpg`.'],
        ['IAM user / role', 'an identity with permissions attached.'],
        ['Policy', 'a JSON document listing allowed actions.'],
        ['Least privilege', 'every identity gets the minimum access it needs. Nothing more.']
      ],
      visual: { caption: 'Block vs object vs file storage', note: 'tap each type', el: <StorageTypes /> },
      demo: { id: 'demo-iam', title: 'ACCESS RULES', hint: 'least privilege', intro: 'Three people, three jobs. Give each exactly the permissions they need: not more, not less.', el: <AccessRules /> },
      lab: {
        id: 'lab-s3',
        title: 'Make a bucket and upload a file',
        goal: 'Use [AWS CloudShell](https://console.aws.amazon.com/cloudshell/) (the `>_` icon in the AWS console). It’s already logged in as you.',
        steps: [
          { do: 'Who am I? (Your account and identity.)', cmd: 'aws sts get-caller-identity', out: '{ "Account": "1234…", "Arn": "arn:aws:iam::1234…:user/ravi" }' },
          { do: 'Make a bucket. The name must be unique worldwide, so add your name and a number:', cmd: 'aws s3 mb s3://ravi-voltide-2026', out: 'make_bucket: ravi-voltide-2026' },
          { do: 'Upload a file and list it:', cmd: 'echo "hello s3" > note.txt\naws s3 cp note.txt s3://ravi-voltide-2026/\naws s3 ls s3://ravi-voltide-2026/', out: 'upload: ./note.txt to s3://ravi-voltide-2026/note.txt\n2026-10-22 10:41:07          9 note.txt' },
          { do: 'Clean up (empty and delete the bucket):', cmd: 'aws s3 rb s3://ravi-voltide-2026 --force', out: 'remove_bucket: ravi-voltide-2026' }
        ],
        safety: 'S3 **Block Public Access** is on by default. Leave it on. Most cloud data leaks are “someone made a bucket public by mistake”. Read: [IAM best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html).'
      },
      links: [
        { href: 'https://console.aws.amazon.com/s3/', label: 'S3 console' },
        { href: 'https://console.aws.amazon.com/iam/', label: 'IAM console' }
      ],
      check: {
        q: 'An intern only needs to **upload** photos to one bucket. Which permission is right?',
        options: ['AdministratorAccess', 's3:PutObject on that one bucket', 'Full access to every service', 'The root account password'],
        answer: 1,
        explain: 'Least privilege: exactly one action on exactly one bucket.'
      }
    },
    {
      id: 'serverless-hadoop',
      hook: 'What if your code only woke up when needed, and you paid per millisecond? And what if 1,000 computers counted your data at once?',
      short: 'Serverless & big data',
      kicker: 'Scale',
      title: 'Serverless functions and Hadoop big data',
      lead: 'Two opposite ends of scale: a tiny function that runs for 100 ms, and a cluster that crunches terabytes.',
      plain: '**Serverless** (AWS Lambda, Google Cloud Functions, Azure Functions) runs your code only when an **event** happens. **Hadoop** splits huge data across many machines and processes it in parallel with **MapReduce**.',
      analogy: {
        type: 'electric',
        text: 'Serverless is a motion-sensor light: on only when someone walks past, so the bill is tiny. Hadoop is a stadium floodlight array: thousands of bulbs lighting one huge field together.'
      },
      jargon: [
        ['Function', 'a small piece of code that runs on an event.'],
        ['Trigger / event', 'what wakes it: a file upload, an HTTP request, a timer.'],
        ['Cold start', 'the small delay when a function wakes up for the first time.'],
        ['HDFS', 'Hadoop’s file system, spread across many machines.'],
        ['MapReduce', 'map (process pieces in parallel) → shuffle (group) → reduce (combine).']
      ],
      visual: { caption: 'An upload wakes a function', note: 'press upload', el: <ServerlessTrigger /> },
      demo: { id: 'demo-mapreduce', title: 'MAPREDUCE WORD COUNT', hint: '4 stages', intro: 'The classic Hadoop example: count words across many machines. Step through all four stages.', el: <MapReduceViz /> },
      lab: {
        id: 'lab-mapreduce',
        title: 'MapReduce with Linux pipes',
        goal: 'On your VM. These pipes do the same three stages Hadoop does, on one machine.',
        steps: [
          { do: 'Make some input:', cmd: 'printf "cloud is fast\\ncloud is cheap\\nfast cloud wins\\n" > words.txt' },
          { do: 'Map (one word per line) → shuffle (sort) → reduce (count):', cmd: "tr ' ' '\\n' < words.txt | sort | uniq -c | sort -rn", out: '      3 cloud\n      2 is\n      2 fast\n      1 wins\n      1 cheap' },
          { do: 'Optional: create a “Hello World” function in the [AWS Lambda console](https://console.aws.amazon.com/lambda/) (Author from scratch → Python), press **Test**, and read the billed duration.' }
        ]
      },
      links: [
        { href: 'https://aws.amazon.com/lambda/', label: 'AWS Lambda' },
        { href: 'https://hadoop.apache.org/', label: 'Apache Hadoop' },
        { href: 'https://cloud.google.com/functions', label: 'Cloud Functions' }
      ],
      check: {
        q: 'A function that resizes photos runs 50 times a day for 200 ms each. Why is serverless a good fit?',
        options: ['You pay only for those few seconds, not a server running all day', 'It makes photos prettier', 'It needs no code', 'It only works on Sundays'],
        answer: 0,
        explain: 'No requests = no cost. A VM would sit idle (and bill you) 99.9% of the day.'
      }
    },
    {
      id: 'databases-chatbots',
      hook: 'Every app you use is a database with a nice outfit on. And the chatbot that answers “where’s my order?” is pattern matching plus AI.',
      short: 'Databases & chatbots',
      kicker: 'Data + AI',
      title: 'Cloud databases and chatbots',
      lead: 'Where apps keep their data, and how a bot figures out what you mean.',
      plain: '**SQL** databases store data in tables with fixed columns. **NoSQL** databases store flexible documents. Cloud providers run both for you (RDS, Cloud SQL, DynamoDB, Firestore). A **chatbot** maps your message to an **intent**, then replies.',
      analogy: {
        type: 'water',
        text: 'SQL is a row of labelled bottles in a crate: every slot the same shape. NoSQL is a flexible water bag: holds odd shapes, harder to stack neatly.'
      },
      jargon: [
        ['Table / row / column', 'how SQL organises data.'],
        ['Query', 'a question to the database, e.g. `SELECT * FROM students;`.'],
        ['Managed database', 'the provider handles backups, patches and scaling.'],
        ['Intent', 'what the user wants (“check fees”).'],
        ['Entity', 'a detail inside the message (“semester 2”).']
      ],
      visual: { caption: 'The same data, two ways', note: 'switch modes', el: <DbCompare /> },
      demo: { id: 'demo-bot', title: 'CAMPUS BOT', hint: '4 intents', intro: 'Chat with a tiny bot. Watch which intent it detects. Get it to understand four topics for a badge.', el: <CampusBot /> },
      lab: {
        id: 'lab-sqlite',
        title: 'Your first database, in the terminal',
        goal: 'On your VM. SQLite is a full SQL database in one file: perfect for practice.',
        steps: [
          { do: 'Install and open a database file:', cmd: 'sudo apt install -y sqlite3\nsqlite3 college.db' },
          { do: 'Create a table, add rows and query it:', cmd: "CREATE TABLE students (roll INT, name TEXT, branch TEXT);\nINSERT INTO students VALUES (101,'Ravi','CSE'), (102,'Ananya','ECE');\nSELECT name FROM students WHERE branch = 'CSE';", out: 'Ravi' },
          { do: 'Exit with `.quit`. The same SQL works on a managed cloud database like [Amazon RDS](https://aws.amazon.com/rds/) or [Cloud SQL](https://cloud.google.com/sql).' }
        ]
      },
      links: [
        { href: 'https://cloud.google.com/dialogflow', label: 'Dialogflow' },
        { href: 'https://aws.amazon.com/lex/', label: 'Amazon Lex' },
        { href: 'https://aws.amazon.com/dynamodb/', label: 'DynamoDB' }
      ],
      check: {
        q: 'A chatbot hears “when can I pay my dues?”. Which intent should it match?',
        options: ['library', 'fees', 'wifi', 'results'],
        answer: 1,
        explain: '“pay” and “dues” are fee words. Intent matching maps different phrasings to the same goal.'
      }
    }
  ],
  takeaway: {
    title: 'Tide is in. 🌊',
    text: 'You launched servers, compiled code, ran a web app, deployed to a PaaS and toured storage, IAM, serverless, big data, databases and chatbots. That’s a real cloud lab done. **Stop your EC2 instance now.** In **Episode 04 · SURGE**, your team deploys a website for real and demos it live.',
    checklist: [
      'I launched an EC2 instance and connected with SSH',
      'I checked CPU, RAM and disk with Linux commands',
      'I compiled and ran a C program on the cloud',
      'I ran a Flask app and opened it in a browser',
      'I stopped my instance so it doesn’t bill me'
    ]
  }
};
