---
title: Get rid of Mac OS X-specific header paths (wikitext, 34972c4)
tags: snippets
---

While including "ruby/ruby.h" will work on Mac OS X, it won't on Linux so change it to "ruby.h" where it should work on both. "mkmf" will take care of specifying the appropriate include search path.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
