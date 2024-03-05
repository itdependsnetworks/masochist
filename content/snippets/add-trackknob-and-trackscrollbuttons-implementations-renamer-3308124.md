---
title: Add trackKnob: and trackScrollButtons: implementations (REnamer, 3308124)
tags: snippets
---

These are pixel-perfect implementations which eliminate all smearing artefacts that occurred when calling super. Unfortunately in order to guarantee this smear-free behaviour some overdrawing is required, but as the area of the scroller is so small this should not pose any performance problem.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
