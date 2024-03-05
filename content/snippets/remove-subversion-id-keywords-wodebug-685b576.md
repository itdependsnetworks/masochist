---
title: Remove Subversion $Id$ keywords (WODebug, 685b576)
tags: snippets
---

Remove now-redundant Subversion-only keywords from source files, as well as related code that incorporates them as part of the build number during the build. Note this commit only removes the code-level components of the build number embedding process; in a separate commit I will modify the corresponding Shell Script build phase.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
