---
title: Command refactoring for better error detection (snippets, 098ddbc)
tags: snippets
---

Refactor most invocations of the git tool into separate methods to allow\
better error checking. Now non-zero exit codes will cause an exception to be\
thrown where appropraite. Harmless errors should not have any effect.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;\
