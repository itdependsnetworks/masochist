---
title: Revert "Teach Haml to respect preformatted text" (typechecked.net, add2e6c)
tags: snippets
---

I'm going to follow Nathan's advice here and just monkey patch the "render" method rather than meddling with Haml's internals. For the timebeing seems the lesser of two evils.

This reverts commit 0eb62734c9e3b266f2138fd51047eaf3ea736374.
