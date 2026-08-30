---
title: "Math — Cauchy's functional equations: four rules that pin down a function"
date: '2026-08-30'
summary: The four classic forms of Cauchy's functional equations — midpoint, additive, logarithmic, exponential — and how each operational property locks in the shape of the function.
---

These four equations are classics from math competitions and calculus: **Cauchy's functional equations** and their variants. The core idea is simple: a function's *operational property* determines its *specific form*.

Here is each rule, what it means intuitively, and where it shows up.

## 1. Midpoint rule

```
f((x+y)/2) = (f(x) + f(y)) / 2  ⟹  f(x) = ax + b
```

**Intuition**: when the input takes the midpoint, the output takes the midpoint too. The graph neither bends up nor bends down — it is a perfectly straight line.

**Geometry**: the midpoint of any two points on the graph still lies on the graph. That is a property *unique* to linear functions (`ax + b`).

**Where it appears**: problems involving midpoints, averages, or smooth linear relationships.

## 2. Additive rule (Cauchy's original)

```
f(x + y) = f(x) + f(y)  ⟹  f(x) = ax
```

**Intuition**: inputs add, so outputs add. This is the most basic Cauchy functional equation.

**Key difference from rule 1**: there is no constant term `b` here. Set `x = 0, y = 0` and you get `f(0) = f(0) + f(0)`, so `f(0) = 0`. The line must pass **through the origin**.

**Real-world example**: direct proportionality — "`x` kg of apples costs `f(x)`, `y` kg costs `f(y)`, so `x + y` kg together costs exactly `f(x) + f(y)`".

## 3. Logarithmic rule

```
f(xy) = f(x) + f(y)  ⟹  f(x) = a·ln(x)
```

**Intuition**: inputs multiply, outputs add.

**The underlying property**: this is the defining identity of logarithms, e.g. `ln(xy) = ln(x) + ln(y)`. A logarithm *flattens multiplication into addition*.

**Real-world examples**: compound-interest years, decibels in acoustics, information entropy.

## 4. Exponential rule

```
f(x + y) = f(x)·f(y)  ⟹  f(x) = c^x
```

**Intuition**: inputs add, outputs multiply.

**The underlying property**: this is the defining identity of exponentials, e.g. `c^(x+y) = c^x · c^y`. Adding a fixed amount to the input doubles or scales the output.

**Real-world examples**: cell division, radioactive decay, bacterial growth, population models.

**A note on notation**: the result is written `c^x` (equivalently `e^{kx}` or `B·a^x`) rather than reusing `a` from the rules above. There, `a` was the slope of a line (`f(x) = ax`, `f(x) = a·ln(x)`); here `c` is a *base* sitting in the exponent position. Different roles, different letters — keeps things unambiguous.

## Cheat sheet

| Equation form | Input operation | Output operation | Function type | Result |
| --- | --- | --- | --- | --- |
| Midpoint | average `(x+y)/2` | average `(f(x)+f(y))/2` | any line | `f(x) = ax + b` |
| Additive | add `x+y` | add `f(x)+f(y)` | line through origin | `f(x) = ax` |
| Logarithmic | multiply `xy` | add `f(x)+f(y)` | logarithm | `f(x) = a·ln(x)` |
| Exponential | add `x+y` | multiply `f(x)f(y)` | exponential | `f(x) = c^x` |

Next time a calculus or function problem hands you a functional equation, check it against these four patterns first — matching one of them tells you the function model immediately, and the problem usually cracks open from there.