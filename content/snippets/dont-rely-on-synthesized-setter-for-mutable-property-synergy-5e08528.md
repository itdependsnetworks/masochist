---
title: Don't rely on synthesized setter for mutable property (Synergy, 5e08528)
tags: snippets
---

A synthesized setter on a mutable property, combined with the copy attribute, will send a copy message to any object passed in to it, thus converting it into an immutable object.

So in this case must provide a non-synthesized setter which correctly employs mutableCopy.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
