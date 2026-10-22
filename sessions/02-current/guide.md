# Field Guide · Episode 02 · CURRENT

The step-by-step flow for Workshop Day 1, Session 02 (*Computer Networks*). The goal from the workshop plan: students understand how a user, a network and a cloud server communicate. Segments are listed in order; there are no fixed timings, so move at the class's pace.

## Before class
- [ ] Release the episode: share the unlock code (see [`facilitator/README.md`](../../facilitator/README.md))
- [ ] Every student's Ubuntu VM from Episode 01 boots and has internet (`ping -c 2 google.com`)
- [ ] If the lab has Windows PCs, open **Command Prompt** once so students can compare `ipconfig` and `tracert`
- [ ] Optional reading for keen students: [Cloudflare Learning Center](https://www.cloudflare.com/learning/) (short, friendly networking articles)

## Segment 1 · Addresses
[Public vs private IPs](#/session/2/topic/ip-addresses): tap through the hostel network map, then race to find a public, a private and a loopback address in the **IP checker**. Ask students to guess the IP of their VM (it starts with `10.0.2.`).

## Segment 2 · Names and the web
1. [DNS](#/session/2/topic/dns): play the lookup, pause at each hop, and ask "who knows the answer here?"
2. [HTTP & HTTPS](#/session/2/topic/http-https): go through all six situations in the **HTTP inspector**. Make the class shout out what 404, 500 and 503 mean.

## Segment 3 · Transport and the path
1. [TCP, UDP & ports](#/session/2/topic/tcp-udp-ports): play TCP, then UDP. Ask: which would you use for a video call, and which for downloading a PDF?
2. [Routers, gateways & NAT](#/session/2/topic/routers-nat): send a packet from each device in the NAT translator and watch the address change.

## Segment 4 · Firewalls
[Firewalls & security groups](#/session/2/topic/firewalls): pairs make all six rows of the **security group simulator** green. Then everyone runs the **ufw lab** in their VM.

| Problem | Fix |
|---|---|
| `ufw: command not found` | `sudo apt install -y ufw` |
| Lost internet after `ufw enable` | Outbound is allowed by default; check `sudo ufw status verbose`, then `sudo ufw disable` to test |
| Worried about lockouts | On a cloud VM, always `sudo ufw allow 22/tcp` before `enable` |

## Segment 5 · Hands-on network commands
1. [Lab: ping & ip addr](#/session/2/topic/lab-ping-ip): warm up in the **network lab simulator** (Linux and Windows modes), then run the real commands in the VM.
2. [Lab: nslookup, curl, traceroute](#/session/2/topic/lab-dns-curl): install the tools, then run each one.

| Problem | Fix |
|---|---|
| `nslookup: command not found` | `sudo apt install -y dnsutils` |
| `traceroute` shows `* * *` | Normal: many routers ignore traceroute. Keep reading the hops that do answer |
| `ping` works by IP but not by name | DNS issue: check `resolvectl status` |
| Anything else | [curl manual](https://curl.se/docs/manual.html) · [Ubuntu networking docs](https://documentation.ubuntu.com/server/explanation/networking/) |

## Segment 6 · Put it together
[Browser → server](#/session/2/topic/browser-to-server): step through the full journey on the projector. Then pairs explain the eight steps to each other without looking. This is the Day 1 takeaway.

## Segment 7 · Boss fight
Run the **PACKET LOSS** boss fight on the projector or in pairs, then decrypt the transmission.

## Exit checklist
- [ ] Can tell public and private IPs apart
- [ ] Ran `ping`, `ip addr` / `ipconfig`, `nslookup`, `curl` and `traceroute`
- [ ] Enabled ufw on the Ubuntu VM
- [ ] Can explain browser → server in eight steps

**Day 1 takeaway (from the workshop plan):** students understand cloud basics, have a working lab environment, and can explain how a browser reaches a server.

**Next:** Episode 03 · TIDE, Day 2 (released by the facilitator).
