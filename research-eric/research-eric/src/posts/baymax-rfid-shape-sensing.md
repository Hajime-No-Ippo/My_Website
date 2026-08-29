---
title: Baymax — RFID shape sensing for soft robots
date: '2026-08-29'
summary: My research idea for a Baymax-like air-based soft robot that senses its own shape change with passive RFID tags.
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

Reading the whole body at once is what everything downstream depends on — shape
reconstruction, posture, contact sensing. That is exactly the gap SATR fills. The open
design choice is where the strain information lives: surface RFID tags, sensors cast
into the pneumatic actuators, or a hybrid.

Next on my list: review the full SATR paper for implementation detail, design a tag
placement strategy, and prototype a single shape-sensing cell before anything gets
integrated with the air system.

— Eric
