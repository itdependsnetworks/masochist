---
title: Make WOLogManager singleton pattern truly advisory (WOCommon, 545d56c)
tags: snippets
---

Commit 343dc6b removed WOLogManager's dependency on WOSingleton but there was one place (in the init method) where the code still had an "enforcement" approach to the singleton pattern. This commit removes that code thus making the behaviour totally advisory.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
