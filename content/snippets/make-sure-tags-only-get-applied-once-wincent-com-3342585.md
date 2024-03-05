---
title: Make sure tags only get applied once (typechecked.net, 3342585)
tags: snippets
---

Use database-level constraints to ensure that tags only get applied once to any given model instance. Application-level constraints are not appropriate because they're vulnerable to race conditions (due to the window between checking if a tag is already applied and trying to apply it).

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
