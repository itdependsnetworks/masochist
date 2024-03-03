---
title: Wikitext 1.1.1 released
tags: wikitext blog
---

I just uploaded a minor maintenance release of my [wikitext](/wiki/wikitext) module, version 1.1.1, whose sole change is a fix for the breakage caused by [API](/wiki/API) changes in [Rails](/wiki/Rails) 2.1.0_RC1.

[Wikitext](/wiki/Wikitext) is a fast wikitext-to-[HTML](/wiki/HTML) translator with a syntax very close to that used by [MediaWiki](/wiki/MediaWiki). It is a [Ruby](/wiki/Ruby) extension written with speed and robustness in mind using a [Ragel](/wiki/Ragel)-generated scanner and a hand-coded parser, all in [C](/wiki/C). It has an enormous spec suite.

You can browse the source code repo, or download the [gem](/wiki/gem) from the [RubyForge](/wiki/RubyForge) [downloads page](http://rubyforge.org/frs/?group_id=5483). For an overview check out the [RDoc](/wiki/RDoc) [here](http://wikitext.rubyforge.org/). If you have [RubyGems](/wiki/RubyGems) then you can install it with `sudo gem install wikitext`, although it may take some time for the new release to propagate out to all the gem mirrors.
