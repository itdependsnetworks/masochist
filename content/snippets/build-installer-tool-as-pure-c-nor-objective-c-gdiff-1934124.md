---
title: Build installer tool as pure C, nor Objective-C (gdiff, 1934124)
tags: snippets
---

The installer tool doesn't (and shouldn't) use the Objective-C runtime, so compile it as pure C rather than Objective-C.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
