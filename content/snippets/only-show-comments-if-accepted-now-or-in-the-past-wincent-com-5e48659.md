---
title: Only show comments if accepted now or in the past (wincent.dev, 5e48659)
tags: snippets
---

There are actually three states we need to distinguish among here: posts where comments are accepted, posts where comments are not accepted but have been in the past, and posts where comments are not accepted now and never have been.

In the first two cases we'll show comment-related stuff in the views, but in the last case we won't show anything at all.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
