---
title: Add notes to WOProcessLauncher class (WOCommon, 366cbb0)
tags: snippets
---

The retain-based model used by the WOProcessLauncher class won't work under GC, so add a warning as a reminder that it needs to be revised.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
