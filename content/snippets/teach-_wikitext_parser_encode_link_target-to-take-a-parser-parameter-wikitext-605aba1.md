---
title: Teach _Wikitext_parser_encode_link_target to take a parser parameter (wikitext, 605aba1)
tags: snippets
---

Instead of passing a string object, pass a pointer to a parser struct instead. This is groundwork for teaching \_Wikitext_parser_encode_link_target how to handle links when "treat slash as special" is in effect.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
