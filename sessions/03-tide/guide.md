# Field Guide · Episode 03 · TIDE

The step-by-step flow for Workshop Day 2, Session 03 (*Cloud Lab Practicals*). Students go from theory to running real workloads on cloud VMs. Segments are listed in order; there are no fixed timings, so move at the class's pace.

## Before class
- [ ] Release the episode: share the unlock code (see [`facilitator/README.md`](../../facilitator/README.md))
- [ ] Decide on accounts: student [AWS Free Tier](https://aws.amazon.com/free/) accounts, or facilitator-provided IAM users in one account. Have students turn on MFA ([guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html))
- [ ] Facilitator: a [Google Cloud](https://console.cloud.google.com/) project with billing enabled, for the App Engine demo
- [ ] Check the campus network allows outbound **SSH (port 22)**. If not, use **EC2 Instance Connect** in the browser
- [ ] Copy [`lab-files/`](lab-files/) to a pen drive or shared folder as a backup

## Segment 1 · Launch a VM
[Launch a VM](#/session/3/topic/launch-vm): everyone clones their local VM in VirtualBox first (it takes seconds and shows how cloud images work). Then do the **EC2 launch practice** until it says "perfect", then launch the real instance in **Mumbai (ap-south-1)**.

| Problem | Fix |
|---|---|
| `Permissions 0644 … too open` | `chmod 400 mykey.pem` (on Windows, use PowerShell `ssh` or EC2 Instance Connect) |
| `Connection timed out` | Security group must allow SSH from **My IP**; the campus IP may have changed, so edit the rule |
| `Permission denied (publickey)` | Use user `ubuntu` for Ubuntu AMIs, and the right `.pem` file |
| No free-tier type listed | Pick whichever of `t2.micro` / `t3.micro` is marked *Free tier eligible* |

## Segment 2 · Know your machine
[Check VM resources](#/session/3/topic/vm-resources): play with the **instance sizer**, then run the lab. Ask students to compare `nproc` and `free -h` on EC2 with their local VM.

## Segment 3 · Run programs
1. [Run a C program](#/session/3/topic/c-program): break the code in the **C playground** on purpose (delete a semicolon) so students see an error before it happens for real.
2. [Run a web app](#/session/3/topic/web-app): visit every route in the **mini web app**, then run Flask on EC2 and open it from a phone.

| Problem | Fix |
|---|---|
| `externally-managed-environment` from pip | Use the venv: `python3 -m venv venv && source venv/bin/activate` |
| Browser times out on port 5000 | Add a security group rule: Custom TCP 5000 from My IP; check `app.run(host="0.0.0.0")` |
| `Address already in use` | An old Flask is still running: `pkill -f app.py` |

## Segment 4 · PaaS
[Deploy with a PaaS](#/session/3/topic/app-engine): run the **deploy race**, then the facilitator deploys to App Engine live from Cloud Shell (students with billing can follow). Disable the app afterwards.

## Segment 5 · Storage and access
[Storage & access](#/session/3/topic/ec2-storage-access): tap through block / object / file storage, then pairs solve the **least privilege** grid. Everyone runs the S3 lab in [AWS CloudShell](https://console.aws.amazon.com/cloudshell/) and deletes the bucket at the end.

## Segment 6 · Serverless, big data, databases, chatbots
1. [Serverless & big data](#/session/3/topic/serverless-hadoop): press upload a few times and read the billed milliseconds. Step through MapReduce, then do the same with Linux pipes.
2. [Databases & chatbots](#/session/3/topic/databases-chatbots): switch between SQL and NoSQL views, then get CampusBot to answer four intents. Show [Dialogflow](https://cloud.google.com/dialogflow) or [Amazon Lex](https://aws.amazon.com/lex/) if time allows.

## Segment 7 · Boss fight
Run the **OUT OF MEMORY** boss fight, then decrypt the transmission.

## Exit checklist
- [ ] EC2 instance launched and reached over SSH
- [ ] C program compiled and run on EC2
- [ ] Flask app opened in a browser
- [ ] S3 bucket created **and deleted**
- [ ] **Instance stopped** (it's used again in Episode 04)

**Next:** Episode 04 · SURGE, the Cloud Deployment Challenge.
