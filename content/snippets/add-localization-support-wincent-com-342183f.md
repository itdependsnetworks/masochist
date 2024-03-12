---
title: Add localization support (wincent.dev, 342183f)
tags: snippets
---

This commit adds a Locale class, a Translation class, and corresponding controllers and migrations. It also modifies the application controller so as to set up the locale if possible using a before_filter. The actual utility methods on the String class are added in lib/string_additions.rb.

This is only a partial implementation, not a full localization stack. Later on may add special support for localized model attributes and possibly other things if the need arises.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
