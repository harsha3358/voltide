# Field Guide · Episode 04 · SURGE

The step-by-step flow for Workshop Day 2, Session 04 (*Cloud Deployment Challenge*). Teams deploy a simple website on a cloud VM, make it public, secure it, troubleshoot it and present it live. Segments are listed in order; there are no fixed timings, so move at the class's pace.

## Before class
- [ ] Release the episode: share the unlock code (see [`facilitator/README.md`](../../facilitator/README.md))
- [ ] One AWS account or IAM user per team, with permission to launch EC2 in **ap-south-1**
- [ ] Copy [`lab-files/index.html`](lab-files/index.html) to a shared folder as a fallback page
- [ ] Make sure phones can use **mobile data** for testing (campus Wi-Fi may block or allow things differently)
- [ ] Print or project the rubric from [Live demo](#/session/4/topic/live-demo)

## Segment 1 · Squads
[Form your squad](#/session/4/topic/teams): teams of three or four fill in the **squad builder**. Check every team has a Deployer who owns the key.

## Segment 2 · Build
[Build the page](#/session/4/topic/build-page): the Builder customises the page in the **page builder** and downloads `index.html`. Teams who want more can edit it in [VS Code](https://code.visualstudio.com/).

## Segment 3 · Deploy
[Deploy with nginx](#/session/4/topic/deploy): press **Deploy** on the pipeline to preview the route, then the Deployer runs the lab while the team writes the runbook.

| Problem | Fix |
|---|---|
| `scp: Permission denied` | Same key and user as SSH: `scp -i mykey.pem index.html ubuntu@IP:~` |
| Still see "Welcome to nginx!" | File isn't in place: `sudo mv ~/index.html /var/www/html/index.html` |
| 403 Forbidden | `sudo chmod 644 /var/www/html/index.html` |
| No scp on Windows | Use PowerShell (OpenSSH is built in), or `sudo nano /var/www/html/index.html` and paste |

## Segment 4 · Test
[Test public access](#/session/4/topic/test-access): the Tester opens the site on a phone with Wi-Fi off. Anyone stuck walks the **troubleshooting tree**. The most common causes are typing `https://` and an HTTP rule limited to *My IP*.

## Segment 5 · Secure
[Secure it](#/session/4/topic/secure-it): teams do the **security review**, then harden their server (updates, ufw, re-check the security group, zero-spend budget).

## Segment 6 · Logs
[Logs & troubleshooting](#/session/4/topic/logs-troubleshoot): solve the three **log detective** cases, then one teammate watches `tail -f access.log` while the others refresh on their phones.

## Segment 7 · Live demos
[Live demo](#/session/4/topic/live-demo): each team rehearses once with the **demo timer**, then presents for three minutes. Score with the rubric (works live 40%, explains the path 30%, security 15%, story 15%).

## Segment 8 · Clean up and final boss
1. [Clean up](#/session/4/topic/cleanup): every team ticks the **clean sweep** list, opening each linked console page. Check the [billing dashboard](https://console.aws.amazon.com/billing/home) together.
2. Run the **FINAL FORM** boss fight, decrypt the last transmission, and show students the **Workshop Graduate** certificate on their profile.

## Exit checklist
- [ ] Team site opened live on a phone on mobile data
- [ ] SSH limited to My IP; only web ports public
- [ ] Demo presented
- [ ] Instances terminated, Elastic IPs released, buckets and functions deleted, App Engine disabled
- [ ] Billing dashboard shows no running charges

**Day 2 takeaway (from the workshop plan):** students can launch, use, deploy on, secure, troubleshoot and shut down cloud resources.

**Shared lab PCs:** after the workshop, open the profile page and use **Reset everything** so the next student starts fresh (see [`facilitator/guide.md`](../../facilitator/guide.md)).
