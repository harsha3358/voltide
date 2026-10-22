# Field Guide · Episode 01 · SPARK

The step-by-step flow for Workshop Day 1, Session 01 (*Cloud Computing + Setup*). Facilitators can teach straight from it, and students can use it to revise. Segments are listed in order; there are no fixed timings, so move at the class's pace.

## Before class
- [ ] Students install **VirtualBox**: [virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads) (or [VMware Workstation Pro](https://support.broadcom.com/), free for personal use)
- [ ] Download the **Ubuntu Desktop** ISO: [ubuntu.com/download/desktop](https://ubuntu.com/download/desktop), then optionally [verify it](https://ubuntu.com/tutorials/how-to-verify-ubuntu)
- [ ] Check laptops: 8 GB RAM recommended (4 GB works), about 40 GB free disk, virtualisation enabled in BIOS
- [ ] Facilitator: keep a pre-built Ubuntu VM image on a pen drive as a backup (from the workshop's *Keep it smooth* notes)
- [ ] Optional for the tour: [AWS Free Tier](https://aws.amazon.com/free/), [Azure for Students](https://azure.microsoft.com/en-us/free/students/), [Google Cloud free tier](https://cloud.google.com/free)

> Low-spec lab PCs? Press the ⚡ button in the top bar to switch to lite mode.

## Segment 1 · Ignite: what is the cloud?
Open [What is the cloud, really?](#/session/1/topic/welcome). Ask the class which apps they used today and where they think those apps run. Run the **myth-buster cards** together: students vote before each flip.

## Segment 2 · From zero: bits and packets
1. [Bits, bytes & data](#/session/1/topic/digital-basics): **binary light switches** on the projector. Challenge: everyone spells their initial in binary.
2. [How the internet works](#/session/1/topic/how-internet-works): press **Send "HELLO"** and pause on each stop.

## Segment 3 · Cloud computing: what and why
1. [Cloud: what & why](#/session/1/topic/cloud-basics): on-demand, pay-as-you-go, regions.
2. [IaaS, PaaS & SaaS](#/session/1/topic/service-models): click On-prem → IaaS → PaaS → SaaS and ask what stays *your* job each time. Then pairs race the **model matcher**.
3. [Public, private & hybrid](#/session/1/topic/deployment-models).
4. [Scaling & pay-as-you-go](#/session/1/topic/elasticity): run the **results-day simulator** in "own servers" mode first (it crashes), then cloud mode. Ask: what happens to the bill at 3 AM?
5. [Cloud history](#/session/1/topic/cloud-history) as a quick story.

**Checkpoint:** each mission ends with a question. Use them as a show-of-hands poll.

## Segment 4 · VMs vs containers
[VMs vs containers](#/session/1/topic/vms-containers): use the diagram, then explain that the lab VM they're about to build is exactly what a cloud IaaS server is.

## Segment 5 · Set up VirtualBox / VMware and Ubuntu
Follow [Set up your Ubuntu VM](#/session/1/topic/virtual-lab) step by step.

| Problem | Fix |
|---|---|
| "VT-x is disabled" | Enable virtualisation in BIOS/UEFI settings |
| VM very slow | Give it 2 CPUs and 4 GB RAM, close other apps, use lite mode for the walkthrough |
| No internet in the VM | Network adapter must be **NAT** |
| Anything else | [VirtualBox docs](https://www.virtualbox.org/wiki/Documentation) |

## Segment 6 · Linux terminal basics
Students complete the 8 missions in the [practice terminal](#/session/1/topic/linux-terminal), then repeat the real lab in Ubuntu, including checking the VM's resources (`nproc`, `free -h`, `df -h`). Keen students can continue with [OverTheWire Bandit](https://overthewire.org/wargames/bandit/).

## Segment 7 · Quick tour: AWS, Azure and Google Cloud
Open the [AWS console](https://console.aws.amazon.com/), [Azure portal](https://portal.azure.com/) and [Google Cloud console](https://console.cloud.google.com/) on the projector. Walk through the [equivalents table](#/session/1/topic/cloud-tour), then the [cloud account safety shield](#/session/1/topic/cloud-account). Students create accounts later, in Episode 03.

## Segment 8 · Boss fight
Run the **LAGZILLA boss fight** together on the projector (class shouts the answers) or in pairs.

## Exit checklist
- [ ] Ubuntu VM boots, has internet and is updated
- [ ] Snapshot "fresh install" taken
- [ ] All 8 terminal missions done
- [ ] Opened the AWS, Azure and Google Cloud consoles

**Day 1 takeaway (from the workshop plan):** students understand cloud basics, have a working lab environment, and (after Episode 02) can explain how a browser reaches a server.

**Next:** Episode 02 · CURRENT (released by the facilitator).
