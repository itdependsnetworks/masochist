---
tags: vim wiki
cache_breaker: 1
title: MacVim fullscreen mode
---

To enter fullscreen mode:

    :set fu

To leave fullscreen mode:

    :set nofu

For more info on fullscreen mode:

    :h 'fullscreen'

Grow to maximum horizontal size on entering fullscreen mode:

    :set fuopt+=maxhorz

For an example config, check out my `.gvimrc` file, specifically:

    set fuopt+=maxhorz                      " grow to maximum horizontal width on entering fullscreen mode
    macmenu &Edit.Find.Find\.\.\. key=<nop> " free up Command-F
    map <D-f> :set invfu<CR>                " toggle fullscreen mode
