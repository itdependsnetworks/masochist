---
title: Markdown sucks
tags: wikitext blog
---

As the author of a [lightweight markup translator](http://wikitext.rubyforge.org/), it was with some interest that I read [this post](http://eigenclass.org/R2/writings/fast-extensible-simplified-markdown-in-ocaml) by Mauricio Fernández titled "On the sad state of markdown processors, and getting thousandfold speed-ups".

I know of [some people](http://fukamachi.org/) who will no doubt be delighted to hear John Gruber's [Markdown](http://daringfireball.net/projects/markdown/) described thusly:

> To add insult to injury, Bluecloth, markdown and python-markdown are ugly hacks that boil down to iterated regexp-based gsubs. I can see why they have a long history of bugs: it is easy for a gsub pass to interfere accidentally with another, and such regexp-based transformations are full of corner cases.

# The test

Mauricio takes the Markdown README, concatenates it 32 times, and feeds it through a number of translators. Gruber's "reference" implementation crashes ignominiously with a segfault on the 10,912-line file. The "standard" [Ruby](/wiki/Ruby) implementation, Bluecloth, takes 2.16 seconds. The [Python](/wiki/Python) equivalent requires 0.35 seconds. Pandoc, written in [Haskell](/wiki/Haskell), takes 0.55 seconds.

Mauricio runs the same test against his own implementation written in OCaml, "Simple_markup", and it clocks in at about 43 milliseconds on his 3 GHz AMD64 test box.

Seeing as one of the primary design goals in my own [wikitext](/wiki/wikitext) translator is speed, I thought I'd compare its throughput. Sure, this is wikitext, not Markdown, but I can still measure the raw throughput anyway, can't I?

    Rehearsal -------------------------------------------------------------------------
    markdown README concatenated 32 times   0.030000   0.000000   0.030000 (  0.033340)
    ---------------------------------------------------------------- total: 0.030000sec

                                                user     system      total        real
    markdown README concatenated 32 times   0.040000   0.000000   0.040000 (  0.033533)

So that's 33 milliseconds on my lowly 1.83 GHz iMac, not bad at all... The truth is, a single 10,912-line file (354,400 bytes) isn't really long enough to produce a meaningful benchmark with a fast translator. The benchmarks I normally use with wikitext actually use four different input samples, each repeated 100,000 times.

I'd also like to compare memory use, but I'm not really sure what the best way to do that would be.
