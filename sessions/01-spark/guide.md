# Field Guide · Session 01 · SPARK

The step-by-step flow for this session. Facilitators can teach straight from it, and students can use it to revise. Segments are listed in order; there are no fixed timings, so move at the class's pace.

## Before class
- [ ] Students install **VirtualBox**: [virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads) (or [VMware Workstation Pro](https://support.broadcom.com/), free for personal use)
- [ ] Download the **Kali Linux VirtualBox image**: [kali.org/get-kali](https://www.kali.org/get-kali/#kali-virtual-machines) → Virtual Machines, then [verify it](https://www.kali.org/docs/introduction/download-images-securely/)
- [ ] Download the **Ubuntu** ISO: [Server](https://ubuntu.com/download/server) or [Desktop](https://ubuntu.com/download/desktop), then [verify it](https://ubuntu.com/tutorials/how-to-verify-ubuntu)
- [ ] Optional for the cloud tour: create free accounts on [AWS Free Tier](https://aws.amazon.com/free/), [Azure for Students](https://azure.microsoft.com/en-us/free/students/) or [Google Cloud free tier](https://cloud.google.com/free), with a billing alert set
- [ ] Check laptops: 8 GB RAM recommended, about 60 GB free disk, virtualisation enabled in BIOS
- [ ] Facilitator: keep a pre-built VM image on a pen drive as a backup

> Low-spec lab PCs? Press the ⚡ button in the top bar to switch to lite mode.

## Segment 1 · Ignite: what are we protecting?
Open [What is cybersecurity?](#/session/1/topic/welcome). Ask the class to name apps they used today (UPI, WhatsApp, the college portal) and what each one protects. Run the **myth-buster cards** together and let students vote before each flip.

## Segment 2 · From zero: bits and packets
1. [Bits, bytes & data](#/session/1/topic/digital-basics): use the **binary light switches** on the projector. Challenge: everyone spells their initial in binary.
2. [How the internet works](#/session/1/topic/how-internet-works): press **Send "HELLO"** and pause on each stop.
3. [Cloud computing from zero](#/session/1/topic/cloud-basics): ask "where does Instagram actually run?" Click through On-prem → IaaS → PaaS → SaaS and ask what stays *your* job each time. Open the [AWS console](https://console.aws.amazon.com/), [Azure portal](https://portal.azure.com/) and [Google Cloud console](https://console.cloud.google.com/) on the projector if internet is available.
4. [Why it matters](#/session/1/topic/why-it-matters): read the three incidents and ask what they share. Answer: missing updates.

**Checkpoint:** each topic ends with a quick question. Use them as a show-of-hands poll.

## Segment 3 · The language of security
- [CIA triad](#/session/1/topic/cia-triad): students invent one example per corner.
- [Threat, vulnerability, risk](#/session/1/topic/threat-vuln-risk): walk through the **risk voltmeter** scenarios, then ask "what would you change to lower it?"
- [Who attacks & why](#/session/1/topic/threat-actors) and the [malware zoo](#/session/1/topic/malware).

## Segment 4 · Hacking humans
[Phishing & illusions](#/session/1/topic/phishing): pairs race to find all **6 red flags**, then use the X-ray lens. Finish with the **homoglyph illusion**; most people get it wrong, which is the point. Homework: [Google's phishing quiz](https://phishingquiz.withgoogle.com/).

Then [passwords & hashing](#/session/1/topic/passwords-hashing): compare a short password with a 4-word passphrase in the strength tester, and change one letter in the hash machine.

## Segment 5 · Rules of the road
[Cyber law & ethics](#/session/1/topic/law-ethics): run the **allowed or not?** quiz as a class debate. Make sure everyone can state the golden rule: *only test what you own or have written permission to test.* Official texts: [IT Act 2000](https://www.indiacode.nic.in/handle/123456789/13683) · [DPDP Act 2023](https://www.indiacode.nic.in/bitstream/123456789/22037/2/a2023-22.pdf) · report crime at [cybercrime.gov.in](https://cybercrime.gov.in/) or call **1930**.

[Your security habits](#/session/1/topic/personal-hygiene): students tick honestly. Whatever is unticked is homework.

## Segment 6 · Build the lab
Follow [Build your safe virtual lab](#/session/1/topic/virtual-lab) step by step, then use the **VMs vs containers** diagram to compare what they just built with how cloud apps ship.

Common problems:
| Problem | Fix |
|---|---|
| "VT-x is disabled" | Enable virtualisation in BIOS/UEFI settings |
| Anything else | [VirtualBox docs](https://www.virtualbox.org/wiki/Documentation) · [Kali docs](https://www.kali.org/docs/) |
| VM very slow | Give it 2 CPUs, close other apps, use lite mode for the walkthrough |
| No IP on host-only adapter | Check *Network Manager → Host-only Networks → DHCP enabled* |
| Ping fails | Both VMs must use the **same** host-only adapter |

## Segment 7 · Terminal from zero
Students complete the 8 missions in the [practice terminal](#/session/1/topic/linux-terminal), then repeat the real lab on Kali, including checking the VM's resources (`nproc`, `free -h`, `df -h`). Keen students can continue with [OverTheWire Bandit](https://overthewire.org/wargames/bandit/).

## Exit checklist
- [ ] Kali and Ubuntu can ping each other
- [ ] Snapshot "clean install" taken on both VMs
- [ ] All 8 terminal missions done
- [ ] MFA switched on for personal email

**Next:** Session 02 · CURRENT (released by the facilitator).
