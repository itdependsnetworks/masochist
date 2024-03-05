---
title: Use anonymous private categories (WOTest, cb0f52f)
tags: snippets
---

"Anonymous" private categories (new in Objective-C 2.0) are a better fit for private methods because they provide an indication to the compiler of what methods are expected to be implemented, not just those that "might" be implemented elsewhere (and available at runtime).

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
