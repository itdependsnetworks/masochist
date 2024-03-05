---
title: Rename lastRegularExpressionError to lastPatternError (REnamer, a99ffb9)
tags: snippets
---

For consistency, seeing as we have a lastSubstitutionError, it makes more sense to have a "lastPatternError". This means that the names for the two types of errors (one in the "Find" string, the other in the "Replace" string) are now more consistent.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
