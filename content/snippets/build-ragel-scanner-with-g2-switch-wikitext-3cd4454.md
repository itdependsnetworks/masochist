---
title: Build Ragel scanner with -G2 switch (wikitext, 3cd4454)
tags: snippets
---

At the recommendation of Adrian Thurston I tried using the -G2 switch to turn on the "really fast goto-driven FSM" code generation style (as opposed to the default table-driven one).

The tokenizer saw a four-fold speed increase (making it almost 38 times faster than ANTLR instead of just 10 times). As a flow-on effect, this reduces the total parse time by about 15%, and there is still plenty of scope for optimization in the parser itself.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
