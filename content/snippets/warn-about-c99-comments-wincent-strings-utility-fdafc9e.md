---
title: Warn about C99 comments (Wincent Strings Utility, fdafc9e)
tags: snippets
---

Although the scanner knows how to recognize both C99 (single-line, Objective-C-style comments) and traditional C commnets (multi-line comments) it is almost certainly an error for the former to be present in a plist or strings file, so issue a warning if found.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
