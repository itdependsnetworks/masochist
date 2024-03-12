---
title: Extract ugly code into new Articles helper (wincent.dev, 3773864)
tags: snippets
---

The "link_to_remote" and "observe_field" calls are ugly and involve a lot of repeated options that appear in both the "new" and "edit" templates, so extract them into the Articles helper.

We also pre-populate the preview content in the edit template (but not in the "new" template because there we don't have any content when the template is first displayed; I may later modify this to handle the situation where there is content due to a failed validation and a re-rendering of the form).

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
