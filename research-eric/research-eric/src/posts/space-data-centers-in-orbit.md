---
title: Space data centers — why now, and what is actually hard
date: '2026-10-12'
summary: "Notes from fleshing out a data-centers-in-orbit idea with Gemini: the limitless-solar power case, the laser/ISL communication problems nobody has a protocol standard for yet, robot-maintainable modular design, and the companies already racing GPUs into orbit."
---

I spent a while fleshing out an idea with Gemini: putting data centers in orbit. It used to be a sci-fi punchline. Today it is a funded industry — an EU feasibility study concluded the case is real, and a startup put the first H100 in orbit a year ago. This is my reading-notes summary of where the idea stands, what the engineering actually hinges on, and where I'd put effort next.

## Why move compute to orbit at all

The honest argument is **power**, not real estate.

- **Limitless solar, 24/7.** Orbital panels never see clouds, night, or seasons, and they have no footprint limit the way a ground site does. The EU ASCEND study sized a 10 MW space datacenter at ~35,000 m² of panels — versus the ISS's ~7,500 m². Starcloud is planning toward 88,000 satellites and 20 GW of orbital compute.
- **A scale comparison that puts it in perspective:** Starlink's entire ~10,000-satellite network produces on the order of **200 MW** of energy, while data centers currently under construction in the US alone exceed **25 GW**. Space is not a competitor to ground compute yet — it's a new resource pool.
- **No water, no municipal stress.** Terrestrial facilities burn millions of litres of municipal water a day for cooling. Orbit uses none (the cooling story is more subtle — below).
- **Data sovereignty.** That was ASCEND's original motivation: Europe processing/storing its own data in orbit under its own control, with net-zero ambitions (its target: shave ~10 TWh / 10% off European datacenter energy use).

## The honest bottlenecks

Listed roughly in the order they'll kill you:

1. **Launch footprint.** Hundreds of tons of server to orbit is a carbon catastrophe today. ASCEND's central conclusion: space cloud becomes viable *only* paired with eco-designed, fully reusable heavy-lift launchers that cut emissions per flight. Starcloud's own breakeven math is ~$500/kg launch cost and ~$0.05/kWh of on-orbit power.
2. **Vacuum cooling.** Space is cold, but a vacuum is an *insulator* — conduction and convection need matter, so dense racks can only reject heat by **radiation**. That's why "largest commercial deployable radiator" is a headline achievement, not a footnote.
3. **Latency.** LEO is genuinely low-latency per hop (single-digit-ms), but you still get a round-trip through the sky you can't avoid. Fine for training, batch jobs, archival, and sensor workloads. Not for interactive sessions, regulatory-trading, or anything round-trip sensitive.
4. **Radiation and debris.** Cosmic rays and flares cause bit flips; the answer is a mix of radiation-hardened silicon, software-level error correction, and debris shielding, plus graceful degradation when something still breaks.

## Communication protocol: the biggest unsolved piece

Radio-frequency links are the wrong tool — too slow and too bandwidth-limited for datacenter-class traffic. Three technologies carry the load:

1. **Free-space optical (laser) links.** Hundreds of Gbps to Tbps per beam, ultra-narrow, so it is also inherently private and doesn't crowd the RF spectrum. This is the connective tissue: Starcloud recently signed for 50+ Starlink **mini laser terminals** across 25+ satellites to turn individual spacecraft into a linked data center.
2. **Distributed constellations & inter-satellite links (ISLs).** A "data center" isn't one satellite — it's a formation-flying swarm with a laser mesh in orbit, routing traffic across the cluster and down to optical ground stations placed in reliably clear-sky regions (high deserts).
3. **Edge processing.** Don't send raw data down at all. Filter, train, and compress in orbit; beam down results. This sidesteps the downlink bottleneck entirely.

**Where I'd add follow-ups:**

- The **protocol stack doesn't exist yet.** Nobody owns "TCP/IP for a meshed LEO cluster." Space laser links drop when satellites slew, occlude, or pass over unlit ground stations — so we need reliable delivery over intermittent links (FEC + retransmission), routing inside an in-orbit mesh, and checkpoint/resume semantics for long training jobs under radiation. Disruption-Tolerant Networking (bundle protocol) ideas are the closest starting point, but they were built for deep-space hours, not LEO milliseconds.
- **Latency math worth doing properly:** a LEO ISL mesh with a handful of hops plausibly gives Earth-like RTT for non-interactive workloads. That should be modelled before assuming "space = too far."
- **Ground-station scheduling as a first-class problem:** burst windows, weather-dependent optical downlinks, and multi-station diversity are a real systems problem, not an afterthought.

## Robot-maintainable space data centers

Nobody launches a technician to swap a dead GPU. The whole maintenance story leans on autonomous **in-orbit servicing, modular assembly, and robotic maintenance** — arms and automated platforms, not suits.

The design consequence: break the data center into **ORUs — orbital replaceable units**. Compute blades and GPU trays become hot-swappable modules behind a robotic interface; the arm yanks a failed ORU and berths a spare, no full de-orbit. This mirrors how Starship-style "PEZ dispenser" deployment works — standardized modules dropped by a heavy lifter, then docked/assembled by robots.

**Follow-ups I'd push:**

- A **standardized ORU docking/servicing interface** (what USB-C-ish connector do all racks share?) so any servicer can swap any vendor's module.
- Honest limits: robots fix *units*, not *components on a board*. So redundancy and graceful degradation (fail-open storage, replicated state) are the real reliability story; a third copy on-orbit beats a robot with a soldering iron.
- A **spare-parts rail**: instead of trying to repair in orbit, de-orbit the failed ORU and berth a fresh one — logistics, not salvage.

## Who is actually building this (verified, Oct 2026)

- **ASCEND** (EU / Thales Alenia Space, 11-partner consortium, feasibility since Jan 2023): concluded space datacenters can cut emissions *if* reusable launchers mature; roadmap is a 50 kW proof-of-concept by ~2031 scaling to 1 GW by 2050.
- **Starcloud** (ex-Lumen Orbit, Redmond WA, founded 2024): launched **Starcloud-1** in Nov 2025 with the **first NVIDIA H100 in orbit**, first on-orbit AI training, and ran a version of Gemini. $170M Series A at $1.1B (Mar 2026, Benchmark/EQT), +$250M at $2.3B (Aug 2026, incl. NVIDIA and Cisco) — $450M total. Starcloud-2 (the 100× power bird with the big radiator + Blackwell + AWS blade) and Starcloud-3 (200 kW, 3 t, Starship-launched) are the concrete next milestones.
- **Aethero** — launched NVIDIA's *first* space-based Jetson GPU in 2025.
- **Aetherflux** — space-based compute/power startup.
- **Google Project Suncatcher** — space-based solar energy.
- **Axiom Space** — an orbital data center capability (ODC T1) on its planned station.

## The real debate: what should orbit run?

It's a timeline tradeoff. **Short term**, launching thousands of tons of servers today is an environmental regression. **Long term**, if reusable clean rockets, in-orbit solar, and robotic operation mature, shifting heavy compute off a crowded grid becomes genuinely attractive.

The open question from my conversation: should these centers take on *everyday internet traffic*, or stay focused on heavy AI and archival workloads? My lean: **start narrow.** Cold/archival storage, batch training, and inference for on-orbit sensors (Earth-observation imagery, satellite data) — workloads with big energy demand, tolerant latency, and no need for sync. Keep interactive and synchronous users on solid ground.

## Where I'd put a bet next

1. **Power as the product.** A solar power satellite that beams energy (or hosts compute near the user's beam footprint) may be the more tractable first business than a full "cloud in space."
2. **The comms protocol is the de-risking target.** Whoever standardizes a pan-vendor laser-ISL stack for ms-scale orbital meshes owns the moat.
3. **Design-for-serviceability.** A satellite bus that treats compute blades like hot-swappable PCIe cards, with a single robotic docking interface, is the engineering unlock behind every roadmap above.
4. **Workload-level radiation tolerance** (checkpoint/restart, FEC, replicated state) rather than betting everything on hardened silicon.
5. **Regulatory early:** data-sovereignty positioning (the ASCEND angle) plus laser/spectrum licensing will gate who actually deploys.

— Eric