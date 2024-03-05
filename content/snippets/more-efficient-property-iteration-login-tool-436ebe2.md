---
title: More efficient property iteration (login-tool, 436ebe2)
tags: snippets
---

Rather than getting properties on each login item one by one (each property requiring an Apple Event round-trip) use the "properties" method in conjunction with the arrayByApplyingSelector: method to slurp down all the properties in a single transaction.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
