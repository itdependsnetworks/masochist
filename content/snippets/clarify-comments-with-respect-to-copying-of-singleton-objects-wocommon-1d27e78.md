---
title: Clarify comments with respect to copying of singleton objects (WOCommon, 1d27e78)
tags: snippets
---

Note that most singleton classes inherit from WOObject, which in turn inherits from NSObject, and that given that neither of these implement the NSCopying protocol "out of the box" then it isn't even necessary to provide a special implementation of copyWithZone: in the vast majority of cases.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
