---
tags: dns macos wiki
title: Resetting the DNS cache on macOS
---

Sometimes a process will claim that a host is unknown when trying to connect with one process (eg. `git push`) but others have no trouble doing so (eg. `ping`). The solution may be to bounce the DNS cache.

# macOS Monterey

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

[Source](https://appletoolbox.com/flush-dns-cache-mac-os-x/)

# macOS High Sierra

```bash
sudo killall -HUP mDNSResponder
sudo killall mDNSResponderHelper
sudo dscacheutil -flushcache
```

[Source](https://help.dreamhost.com/hc/en-us/articles/214981288-Flushing-your-DNS-cache-in-Mac-OS-X-and-Linux)

# Older notes

## The finessed approach

```shell
$ sudo launchctl unload -w /System/Library/LaunchDaemons/com.apple.mDNSResponder.plist
$ sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.mDNSResponder.plist
```

Verified to work on [OS X](/wiki/OS_X) 10.11.2 [El Capitan](/wiki/El_Capitan).

### Source

-   <http://apple.stackexchange.com/a/48828/158927>

## Via brute force

```shell
$ sudo killall -HUP mDNSResponder
```

### Source

-   <http://support.apple.com/kb/ht5343>

# See also

-   [Clearing Chrome's DNS cache](/wiki/Clearing_Chrome%27s_DNS_cache)
