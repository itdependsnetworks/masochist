---
title: Use GIT_PAGER instead of PAGER (buildtools, d3177b3)
tags: snippets
---

The previous commit (fd2e869) worked but using GIT_PAGER rather than PAGER is strictly more correct in terms of the intention behind the commit (stopping Git from using the pager).

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
