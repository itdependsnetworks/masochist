---
title: Extract arrowsTogether method and other cleanup (REnamer, 4ed8742)
tags: snippets
---

Things are slightly neater with the code that determines whether the scroll arrows are together or at opposite ends of the scroller is extracted out into a separate method.

By way of other cleanup, we also rename the knob variable to knobRect for consistency with the other variables in the rectForPart: method.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
