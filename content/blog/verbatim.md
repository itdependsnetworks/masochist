---
title: Verbatim
tags: blog
---

Currently running a huge merge between the [Tiger](http://typechecked.net/wiki/Tiger) and [Leopard](http://typechecked.net/wiki/Leopard) branches of one of my projects ([WOCommon](http://typechecked.net/wiki/WOCommon)). [SVK](http://typechecked.net/wiki/SVK) really makes this kind of thing a breeze... I was about to say, "I don't know how I ever lived without it", but the truth is I _do_ know exactly how I lived without it: I basically avoided [branching](http://typechecked.net/wiki/branching) and [merging](http://typechecked.net/wiki/merging) and did as little of it as possible.

That's a shame because if I had known about [SVK](http://typechecked.net/wiki/SVK) sooner I could have kept my development process much more nimble: with branches for long-running, disruptive changes on the one hand, and others for stable, release-worthy snapshots at any time.

I'm afraid I slipped up on this merge by forgetting to pass the `--verbatim` switch to `svk`... So there have been a couple of hundred log messages like [this one](http://typechecked.net/a/about/wincent/weblog/svn-log/archives/2007/04/wocommon_r490_2_items_changed.php) which are prepended by some [SVK](http://typechecked.net/wiki/SVK) metadata (`r1485@cuzco (orig r239): wincent | 2006-12-22 20:17:52 +0100` in this case) that I don't really want cluttering up my log messages... ah well.

### Bugs

Of course, [SVK](http://typechecked.net/wiki/SVK) is still not perfect and has its share of bugs. After a couple of hundred changes I got this:

    Too many open files: Can't open file '/Users/wincent/.svk/local/db/revs/1262': Too many open files

So fairly obvious there are still some resource leakage issues to be taken care of.

On trying again:

    Transaction is out of date: Out of date: '/trunk/WOBaseCore/WOSingleton+WOBaseCore.m' in transaction '538-1'
    Please sync mirrored path /mirrors/WOCommon/trunk first.

I had to perform the suggested `sync` before proceeding:

    svk sync -a //mirrors/WOCommon

### Conclusion

But little glitches aside, [SVK](http://typechecked.net/wiki/SVK) is a great tool. For the most part it's just a case of firing off the merge and resolving the occasional conflict; and conflict resolution is a pleasure thanks to the tight integration with [Apple](http://typechecked.net/wiki/Apple)'s [FileMerge](http://typechecked.net/wiki/FileMerge). [Subversion](http://typechecked.net/wiki/Subversion) 1.5 is around the corner and will finally bring some rudimentary [merge tracking](http://typechecked.net/wiki/merge%20tracking) facilities, but it still has a long way to go to catch up with [SVK](http://typechecked.net/wiki/SVK).
