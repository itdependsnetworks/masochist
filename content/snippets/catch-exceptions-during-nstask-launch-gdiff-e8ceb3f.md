---
title: Catch exceptions during NSTask launch (gdiff, e8ceb3f)
tags: snippets
---

Although ditto should be present on all Mac OS X systems (it is included in the base install) NSTask could conceivably throw an exception if the launch path is not accessible (for example if the user has manually removed ditto); catch those exceptions.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
