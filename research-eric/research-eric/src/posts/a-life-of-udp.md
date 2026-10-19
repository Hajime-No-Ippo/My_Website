---
title: "Thoughts — A Life of UDP"
date: "2026-10-19"
summary: "Notes from this week's CS320 transport-layer labs: what the simplest protocol on the internet actually does for a living, why 'unreliable' is a feature, and what a packet's life looks like from a Python echo client to the wire and back."
---

This week's CS320 labs were all about UDP — reading RFC 768, taking apart packets in Wireshark, and answering questions as basic as "how many bytes is the header?" I kept thinking about it afterwards. TCP gets the glory: handshakes, congestion control, reliability. UDP just... shows up. Eight bytes of header and a shrug. So here are some thoughts on what UDP's life actually looks like, and why the internet keeps hiring it.

## Born with nothing

> [!quote]
> UDP's entire inheritance from its parents is an address and a job description. No handshake, no childhood connection phase, no state to carry around.

RFC 768 gives the whole thing away with how short it is. The header is four fields, two bytes each:

```
+--------+--------+--------+--------+
|   Source Port   | Destination Port|
+--------+--------+--------+--------+
|     Length      |    Checksum     |
+--------+--------+--------+--------+
```

Eight bytes. That's it. TCP's header starts at twenty and grows options on top. UDP has to guess nothing, negotiate nothing, remember nothing. When I sent "hello" from the lab's Python echo client, Wireshark showed Length = 13 — eight bytes of header plus five bytes of payload — and the reply simply arrived with the ports flipped: my source port became its destination port. The return address, inverted. No session ever existed.

## A day's work: fire, forget, move on

UDP's working day is a rhythm: the application hands it a chunk of data, it stamps a source and destination port on it, computes a checksum, and drops it into IP. It does not ask whether the last packet arrived.

That reads like negligence until you see the four reasons the textbook gives for choosing it:

- **Finer control** — you decide exactly when and what you send; no algorithm breathing down your neck.
- **No handshake** — the first byte of real data moves immediately; no RTT wasted on pleasantries.
- **No connection state** — nothing to tear down, nothing to leak.
- **Tiny overhead** — 8 bytes against TCP's 20.

DNS lives this way. A query is one small question and one small answer; a whole connection for that is ceremony. VoIP, live games, streaming — they all live this way too, because a lost packet in a conversation is a blip, not a catastrophe. You can hear the philosophy in the design: the network should carry bits, not manage feelings.

## The end-to-end gospel

The checksum deserves its own thought. It's a ones-complement sum over the pseudo-header, the UDP header, and the payload — and it only *detects* damage. UDP doesn't retransmit, doesn't even tell you what to do with a bad packet: discard it or warn the application, that's the whole menu.

This is the end-to-end principle (Saltzer, Reed, Clark, 1984) in its purest form: don't pay for reliability at every hop when only the two ends actually care whether the data arrived. The sender's application can retransmit if it wants. The receiver's application can ask again. UDP refuses to pretend it can guarantee anything, and that refusal is exactly what makes it fast.

> [!thought]
> The pattern generalises past networking. Anything that promises reliability at every layer ends up paying twice for it — once in the middle, once at the end. The layers that do less are often the ones that last longer.

## Who hires UDP, and who doesn't

A quick map of the labour market from the labs:

| Typically UDP | Typically TCP |
|---|---|
| DNS, SNMP, RIP, NFS | HTTP, SMTP, FTP, Telnet |
| Live video/audio, games | Anything that must be byte-exact |

Multimedia hires both, depending on the job. And there's a social consequence I hadn't appreciated before: because UDP runs no congestion control, a crowd of UDP senders can step on TCP flows sharing the same link. Politeness turns out to be a transport-layer feature, not a law of physics.

## What I'd forgotten: it's still everywhere

The odd part of studying UDP is realising it never left. Every DNS lookup I've ever made ran over it. Every online game ping. The lab client I ran was twenty lines of Python2 — `SOCK_DGRAM`, `sendto`, `recvfrom` — and that simplicity *is* the design's success metric. Forty-odd years after RFC 768, the protocol still fits in a student lab without modification.

TCP's life is a story: open, sequence, acknowledge, retransmit, close. UDP's life is a single sentence — deliver this, or don't, I'll handle it. I think I prefer the honesty.

— Eric
