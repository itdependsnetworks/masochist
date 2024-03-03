---
title: Command-T 1.2.1 released
tags: releases command.t blog
cache_breaker: 1
---

I've just released version 1.2.1 of the [Command-T](/wiki/Command-T) plug-in, a powerful, [open source](/wiki/open_source) file and buffer-navigation plug-in inspired by the "Command-T" feature in [TextMate](/wiki/TextMate).

# What's changed since [the 1.2 release](/blog/command-t-1.2-released)

This is a bug-fix release which addresses a "duplicate tag" error when generating Vim help tags, and also mitigates an issue with a potentially distracting blinking cursor when running in non-GUI versions of Vim.

As always, a full change-log appears under HISTORY in the documentation, and you can explore the commits in the release [here](/repos/command-t/tags/1.2.1). (Note: the integrated repository browser that I'm linking to here is still relatively new and doesn't have a full feature set yet.)

# Installation

Command-T is a combination of C, Ruby and Vim's built-in scripting language, which means that you need not only Ruby and a suitable C compiler on your system, but you also have to make sure you use compatible versions. That is, you can't link your Vim against Ruby 1.9.2 and Command-T against Ruby 1.8.7 without things going "Boom!". For some reason, people _love_ playing with different Ruby versions, via [RVM](/wiki/RVM) and other means, and this has generated no small number of tickets in the [issue tracker](/wiki/issue_tracker).

Windows is the worst platform of all, unsurprisingly. Getting Ruby, Vim and Command-T working together on Windows is similar in difficulty to transmuting lead into gold; if anything, transmuting may be easier.

So, if you're unfortunate enough to be using Windows, or if you're the sort that likes to play with different versions of Ruby, all I can do is encourage you to read the documentation very, very carefully — I've done my best to make it accurate and comprehensive — stick to the recommended, known-working versions, and maybe watch the installation screencasts on [the Command-T product page](/products/command-t).

## [Pathogen](/wiki/Pathogen) users

```shell
$ cd path/to/your/pathogen/bundle # probably ~/.vim/bundle
$ git clone git://git.typechecked.net/command-t.git
$ cd command-t
$ rake make
```

And in Vim:

    :call pathogen#helptags()

See the docs for more info on installing (and updating) Command-T via Pathogen.

## Everybody else

-   Download the vimball from [the Command-T product page](/products/command-t) (or [www.vim.org](http://www.vim.org/scripts/script.php?script_id=3025), if you prefer)
-   Open the vimball archive in vim, and do `:so %` to unpack it
-   `cd ~/.vim/ruby/command-t && ruby extconf.rb && make`

# Screencasts, donations and source code

If you're a [Vim](/wiki/Vim) user check out the [screencasts](/products/command-t) and give the plug-in a try. If you'd like to support development you can use [the donations page](/products/command-t/donations) to make a donation, or consider submitting a patch for the project (the source code can be browsed [here](/repos/command-t)).
