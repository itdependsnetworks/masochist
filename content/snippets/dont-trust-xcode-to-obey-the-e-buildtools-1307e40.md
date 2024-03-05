---
title: Don't trust Xcode to obey the -e (buildtools, 1307e40)
tags: snippets
---

Xcode will use its own shebang line and thus ignore the "-e" switch, so use an explicit "set" statement instead.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
