# Episode 03 · TIDE: Cloud Lab Practicals 🔒

> Stop talking about the cloud. Start using it.
> *(Cloud Computing Workshop · Day 2 · Session 03: Cloud Lab Practicals)*

**Open in the app:** `#/session/3` · **Field guide:** [`guide.md`](guide.md) (or `#/session/3/guide`)

Locked until the facilitator shares the code (see [`facilitator/README.md`](../../facilitator/README.md)).

## By the end, students can
- Launch a VM in VirtualBox and an instance on AWS EC2, then connect with SSH
- Check a VM's OS, CPU, RAM and disk with Linux commands
- Compile and run a C program on a cloud VM
- Run a Python (Flask) web app and open it in a browser
- Explain how a PaaS like Google App Engine deploys code for them
- Tell block, object and file storage apart, and apply least privilege
- Explain serverless, MapReduce, SQL vs NoSQL and how chatbots match intents

## Missions
| # | Mission | Demo / lab | Deep link |
|---|---|---|---|
| 01 | Launch a VM | EC2 launch practice + **Lab:** VM clone + EC2 + SSH | `#/session/3/topic/launch-vm` |
| 02 | Check VM resources | Instance sizer + **Lab:** `uname`, `nproc`, `free`, `df`, `top` | `#/session/3/topic/vm-resources` |
| 03 | Run a C program | C playground + **Lab:** gcc on EC2 | `#/session/3/topic/c-program` |
| 04 | Run a web app | Mini web app + **Lab:** Flask on port 5000 | `#/session/3/topic/web-app` |
| 05 | Deploy with a PaaS | IaaS vs PaaS race + **Lab:** App Engine | `#/session/3/topic/app-engine` |
| 06 | Storage & access | Storage types + least-privilege grid + **Lab:** S3 in CloudShell | `#/session/3/topic/ec2-storage-access` |
| 07 | Serverless & big data | Upload → function + MapReduce word count + **Lab:** Linux pipes | `#/session/3/topic/serverless-hadoop` |
| 08 | Databases & chatbots | SQL vs NoSQL + campus chatbot + **Lab:** SQLite | `#/session/3/topic/databases-chatbots` |

Ends with the **OUT OF MEMORY boss fight** and the decrypted secret transmission. Badges: Launcher, Compiler Kid, PaaS Pilot, Least Privilege, Big Data, Bot Whisperer, plus the boss and decoder badges.

## Files
- `content.jsx`: all mission text, checkpoints, labs and boss questions
- `demos/`: interactive pieces · `visuals/`: animated diagrams
- `lab-files/`: ready-made `hello.c`, `app.py` and an `app-engine/` folder (`main.py`, `requirements.txt`, `app.yaml`)

## Before class
Students need an AWS account (or the facilitator's lab accounts), and the facilitator needs a Google Cloud project with billing for the App Engine demo. See *Before class* in the [field guide](guide.md#before-class).
