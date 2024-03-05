---
title: Proof WO_BOOL macro against overflows (WOCommon, d03a5b0)
tags: snippets
---

Use the double-negation trick to ensure that a real boolean value is obtained in the WO_BOOL macro; without this trick the supplied expression is evaluated and cast to BOOL, which may not produce the expected result for large values.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
