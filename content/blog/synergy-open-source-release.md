---
title: Synergy open source release
tags: synergy open.source blog
cache_breaker: 1
---

[Synergy](/wiki/Synergy) was originally released in November 2002, and over the years has received many updates. Due to competing demands on my time, the release rate slowed down as the years went on, and at the time of writing, the last release was version 4.5.2, on February 1, 2011.

In March 2011 I started a new job which demanded my full attention.

I've realized that this means that in the immediate future Synergy is unlikely to get the attention from me that it deserves, yet people still use it and would like to see development work to continue.

The simplest way to make that possible is to open source the project. This isn't just a means to keep the project alive; I strongly believe that open source is the right way to do software development and in the future it will be the only way that seriously-taken software is developed.

The source code is now BSD licensed. [I've been working towards open sourcing everything](/blog/embracing-open-source) for a long time now. This is a big step in that direction.

The initial source code release is based off the code that was used to build version 4.5.2, minus the serial number code and third-party code (such as a local copy of the Growl framework) which I did not want to distribute. I'm hoping this will be just the first of several such open source releases that I can make in the near future.

Synergy will still be available for download and purchase on wincent.com. Maybe in the future my circumstances will change and I'll be able to fully re-enter the world of Mac OS X development, in which case I'd like to work on getting Synergy into Apple's App Store.

Periodically-updated backup mirrors are already in place at [GitHub](/wiki/GitHub) and [Gitorious](/wiki/Gitorious):

-   <http://github.com/wincent/synergy/>
-   <http://gitorious.org/synergy>

This was the first time I'd written a piece of software that went beyond a pet project. Looking back at it now, I truly shudder at some of the ghastly code I wrote while I was learning C, learning Objective-C, learning Apple's APIs, learning object-oriented programming, learning MVC architecture, learning design patterns etc, all at once. Some of this stuff, particularly the files and methods that were written earlier on, is truly cringe-worthy and would not look out of place on thedailywtf.com.

On the other hand, looking back on it makes me realize how much I've grown as a developer over the last ten years. Its been an amazing ride.
