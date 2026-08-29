---
title: Baymax — RFID shape sensing for soft robots
date: '2026-08-29'
summary: My research idea for a Baymax-like air-based soft robot that senses its own shape change with passive RFID tags — and the open question of whether a dense RF array can reconstruct deformation, not just read tags.
---

I keep coming back to one project idea: a Baymax-like air-based soft robot that can
sense its own shape change. This is my reading-notes summary of where that research
currently stands.

## The problem

Most soft sensors have to be hardwired to a power supply or to external processing
gear, and that fights the whole point of a soft, mobile body. RFID flips the problem:
the tags are passive (no battery), a single reader can interrogate many of them, and
the tags deform with the body they sit on. Shape sensing then works by watching the
resonant frequency shift as a tag stretches.

The catch is that when many tags on one body respond at once, their signals collide.
That collision problem is the heart of the research.

## The core paper

*Multi-Tag Collision Recovery in UHF-RFID Using Self-Attention Decoding*
(Akyildiz, Gooty, Mahdavifar, Ebrahimi; 2026) proposes a transformer-based decoder
called **SATR**. It recovers information from up to **4 simultaneous tag responses**
with a **5.1x throughput improvement** over conventional collision-avoidance methods.
For Baymax this is the gating piece — shape sensing only works if every tag across
the body can be read at once rather than one at a time.

But there is an important distinction to hold onto: **collision recovery and shape
sensing are different problems.** You can solve RFID anti-collision perfectly and
still have a sensing system too slow for robotic touch or control. SATR solves the
communication bottleneck ("who transmitted what"); it does not by itself tell you
where an element sits or how the body under it moved.

## The sensing stack

Three bodies of work converge:

- **RFID curvature modeling.** WiSh (MobiSys 2018) reconstructs surface shape from
  passive tags with a single-antenna reader — mm-accurate shape tracking via
  Bézier-curve modeling of curvature instead of localising each tag.
- **RFID in soft pneumatic robots.** A long-range stretchable RFID strain sensor
  (PMC 2019, Ecoflex + liquid-metal microfluidics) was embedded directly in pneumatic
  robot legs for wireless movement monitoring at over 7.5 m. Closest published
  precedent to what I'm asking for.
- **Collision handling.** The SATR paper above makes dense multi-tag reading viable.

## Shape reconstruction without retraining

A soft body is hard to model analytically, so the plan leans on two reconstruction
approaches. The first is optimization-based: a *Soft Robotics* (2025) framework
reconstructs 3D shape from sparsely distributed strain sensors with under 4%
displacement error. The second is a zero-shot deformable reconstruction (arXiv 2026)
that handles unseen soft robots from a flexible sensor array plus cage-based 3D
Gaussian modeling — no robot-specific training.

## Where sensing lives

It does not have to be a separate layer. Bellows-shaped magnetic-elastomer
self-sensing composites and liquid-metal piecewise curvature sensors show the
pneumatic bladder can report its own bend direction and external force. For a body
built around air chambers, that pairs naturally with a surface RFID layer.

Materials I'm tracking: Ecoflex and PDMS for stretchable substrates, Galinstan liquid
metal and conductive nanocomposites for the conductive paths, and machine knitting
(PneuAct, MIT) or 3D-printed molds for fabrication.

## The open question

The deeper idea here is to stop treating collisions as waste and let the RF signals
collide on purpose. SATR operates on the **raw I/Q waveform** and learns the structure
of overlapping responses, treating collision recovery as a **set-prediction problem**
(the tags have no meaningful order, so A+B+C and C+A+B are the same event). That matters
for a skin, because a 20×20 array of RFID elements doesn't want to be read one at a
time — it wants to be read as one dense, deliberately colliding field.

That shift suggests a lean research hypothesis:

> Can the RF response of a dense passive RFID / resonant array encode enough **spatial**
> information to reconstruct the deformation of an inflatable surface — rather than just
> identify its tags?

I'm thinking of this as a three-layer stack:

1. **RF acquisition** — passive RFID / resonant sensors, one reader, raw I/Q.
2. **RF decoding** — a SATR-style transformer recover individual sensor responses
   from the collided waveform.
3. **Physical reconstruction** — the actual research problem: responses + known sensor
   geometry + inflatable-body physics → deformation field → contact map → shape.

For the third layer, a neural field / FNO / GNN over the sensor responses looks like the
natural fit, since the body is too soft to model analytically.

This is the point where the idea stops being an application of RFID and becomes a real
open research question. Next on my list: review the full SATR paper for implementation
detail, design a tag placement strategy, and prototype a single shape-sensing cell
before anything gets integrated with the air system.

— Eric
