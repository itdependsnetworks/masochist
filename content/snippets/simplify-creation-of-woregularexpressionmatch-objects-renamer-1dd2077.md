---
title: Simplify creation of WORegularExpressionMatch objects (REnamer, 1dd2077)
tags: snippets
---

Rather than calling pcre_get_substring() just create the string directly ourselves; the total number of allocations is rougly the same but the code is simpler.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
