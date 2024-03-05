---
title: Invert sense of "trim" parameter in sanitization function (wikitext, e3b5ea0)
tags: snippets
---

There are only two real call sites of this function, one in rollback mode and the other when emitting a valid link. Rename the parameter to "rollback" and invert the sense so that passing Qtrue indicates "in rollback mode" and Qfalse "not in rollback mode".

This in turn will help us when converting spaces to underscores when space_to_underscore is set to Qtrue.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
