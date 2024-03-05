---
title: Update tests to use new Foundation API (WOCommon, 09eae47)
tags: snippets
---

In ripping out my old NSRect-to-CGRect functions I overlooked a couple of places in the test suite where they were still used. This commit replaces those instances with calls to the system-provided functions.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
