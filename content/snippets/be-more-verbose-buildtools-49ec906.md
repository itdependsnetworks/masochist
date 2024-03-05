---
title: Be more verbose (buildtools, 49ec906)
tags: snippets
---

While trying to debug a failure case I noticed that it was possible for the script to terminate early (due to the "set -e") but for no error message to be printed to the standard error.

So be more verbose about what's happening, and install an exit trap to draw attention to an unexpected early exit.

Signed-off-by: Greg Hurrell &lt;greg@hurrell.net&gt;
