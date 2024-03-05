---
title: Drop redundant authentication specs (typechecked.net, 1545453)
tags: snippets
---

The authentication code is so intimately intertwined with the User model and all the rest that it doesn't make much sense to try and test it independently.

Remove the specs which redundantly re-test stuff that is already tested elsewhere. This makes one less site to have to worry about updating when refactoring.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
