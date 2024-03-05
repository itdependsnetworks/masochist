---
title: Always direct error and diagnostic output to the stderr (buildtools, 4654413)
tags: snippets
---

Without this it may be harder to diagnose script failures (for example, in the ReleaseNotes.sh script we normally redirect the output to a file; in that case any error messages wind up in the file rather than in the Xcode build window where we want to see them).

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
