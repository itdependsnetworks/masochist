---
title: GC changes for NSString+WOEmailUtilities class (WOCommon, 6375f08)
tags: snippets
---

With the changes in semantics of CF objects under GC in Leopard it makes more sense just to work at the CF level throughout the emailMessage:subject:to: method rather than casting to Cocoa objects.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
