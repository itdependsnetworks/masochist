---
title: Use non-greedy match when searching for a unique permalink (wincent.dev, 9abb465)
tags: snippets
---

This prevents "foo" from being confused with "foo-bar", "foo-bar-2" and so on. I am not sure whether REGEXP is a MySQL extension or not, but seeing as I am deploying with MySQL that shouldn't be a problem anyway.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
