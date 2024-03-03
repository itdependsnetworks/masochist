---
title: Wikitext 3.0b released
tags: releases wikitext blog
---

A new beta release of the [Wikitext](/wiki/Wikitext) gem, version 3.0b, is out. The major version bump is because this release breaks backwards compatibility with versions of [Rails](/wiki/Rails) prior to 3.1. Given how volatile the Rails [APIs](/wiki/APIs) are, I decided it would be easier to support 3.1 in a new major version of the Wikitext gem, and continue to support older versions (specifically the 2.1.x series) for use with older versions of Rails.

There are no new features or bugfixes in this release. The main changes of interest are tweaks to eliminate deprecation warnings added when running under Rails 3.1. (Prior versions of the Wikitext gem actually will run under Rails 3.1 without modification, but you may see deprecation warnings in the console.)

# About the gem

[Wikitext](/wiki/Wikitext) is a fast wikitext-to-[HTML](/wiki/HTML) translator with a syntax very close to that used by [MediaWiki](/wiki/MediaWiki). It is a [Ruby](/wiki/Ruby) extension written with speed and robustness in mind using a [Ragel](/wiki/Ragel)-generated scanner and an extremely fast hand-coded parser, all in [C](/wiki/C). It has an enormous spec suite.

You can browse the source code repo [here](/repos/wikitext), or download the [gem](/wiki/gem) from the [rubygems.org downloads page](http://rubygems.org/gems/wikitext). For an overview of how to use the extension check out the docs [here](/products/wikitext/doc/). If you have [RubyGems](/wiki/RubyGems) then you can install it with either `gem install --pre wikitext` or `sudo gem install --pre wikitext`. (To get the previous stable release, `gem install wikitext` or `sudo gem install wikitext` will suffice.)

If you find the extension useful please consider making a [donation](https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=win@wincent.com&item_name=Wikitext+donation&no_note=1&currency_code=EUR&lc=GB) via PayPal to <win@wincent.com>.
