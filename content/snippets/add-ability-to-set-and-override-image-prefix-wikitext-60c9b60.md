---
title: Add ability to set and override image prefix (wikitext, 60c9b60)
tags: snippets
---

By default a reference like {{foo.png}} will now create an img tag which sources "/images/foo.png". This can be overridden using the img_prefix attribute, or by passing an option when initializing the parser. See the specs for a demonstration of the various options.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
