---
title: Fix typo in defined test (wikitext, 4494181)
tags: snippets
---

Was testing for "define" instead of "defined", breaking the test. GCC on Mac OS X didn't report any warnings for this, but I GCC on RHEL 3 did.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
