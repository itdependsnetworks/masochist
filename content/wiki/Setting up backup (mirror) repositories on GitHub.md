---
tags: git wiki
cache_breaker: 1
title: Setting up backup (mirror) repositories on GitHub
---

# For the impatient

Once the preliminary set-up is out the way, adding new backups is as easy as:

    # given local user $GIT_USER, $GITHUB_USER, and $GITHUB_REPO
    cd /path/to/repo
    sudo -u $GIT_USER git remote add --mirror github git@github.com:$GITHUB_USER/$GITHUB_REPO.git

    # either wait for the cron job to propagate the changes, or...
    sudo -u $GIT_USER -s -H
    git push github

# Overview

I typically work with a few of local repositories (one on my old iMac desktop machine, another on my old PowerBook laptop, and another on a USB stick) and one central, authoritative repo. This article talks about adding another remote repo, hosted at GitHub, to serve as a backup/mirror:

       "authoritative"                            backup/mirror
          bare repo   ------------------------->    bare repo
      (git.typechecked.net)   push --mirror         (GitHub)
              ^
              |
              | push
              |
              |                   pull
         desktop repo    -------------------->      laptop repo
      active development <-------------------- occasional development
            |   ^                 pull
            |   |
       pull |   | pull
            |   |
            v   |
        USB stick repo
    occasional development

In "[Setting up backup (mirror) repositories on Gitorious](/wiki/Setting_up_backup_%28mirror%29_repositories_on_Gitorious)" I describe adding an additional backup/mirror repo.

It should be noted that these "backups" _are_ intended to provide some data redundancy but there are _not_ intended to protect against data loss in the "authoritative" repo caused by user stupidity (for example, destructive re-writing of history, or deleting branches).

In the event of user stupidity, the mirrors will be duly updated and the data will be truly gone: branches deleted from the "authoritative" repo will be deleted on the mirrors automatically from within a cron job.

The user (me) should only ever be pushing out fast-forward merges to the "authoritative" repo, and never rolling back or rewriting history. Basically if you try to do a `git push` to such a repo and [Git](/wiki/Git) warns you that you can't push without forcing, then you shouldn't be pushing. Instead, pull, resolve conflicts if necessary, and push again; or perhaps rethink what you're trying to do.

# Setting up a private/public key pair

This step needs to only be performed once because the we'll be using the same key pair for all repositories.

We will need to run with elevated privileges because we want to execute commands as another user (the user [Git](/wiki/Git) runs as):

    $ sudo -i

Switch to the user's home directory:

    # cd /path/to/git/home

Create the `.ssh` directory (only if it does not already exist; it most likely does if you've been pushing into the repo via [SSH](/wiki/SSH)):

    # sudo -u user mkdir .ssh
    # chmod 700 .ssh
    # cd .ssh

If there isn't a key pair already, make one thusly:

    # sudo -u user ssh-keygen -t dsa
    Generating public/private dsa key pair.
    Enter file in which to save the key (/path/to/git/home/.ssh/id_dsa):
    Enter passphrase (empty for no passphrase):
    Enter same passphrase again:
    Your identification has been saved in /path/to/git/home/.ssh/id_dsa.
    Your public key has been saved in /path/to/git/home/.ssh/id_dsa.pub.
    The key fingerprint is:
    00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00 user@example.com

**A note about passphraseless key files:** Seeing as this key is _only_ for pushing to the backup/mirror repository, _and_ you want such backups to run automatically (unattended), _and_ you're not going to be around every time the server reboots to feed a passphrase into `ssh-agent`, _and_ the backup is not supposed to be "authoritative" (it's just there for some data redundancy) so you literally don't care about security, you _might_ want to hit "enter" for no passphrase above.

1.  Visit: <http://github.com/account#keys>
2.  Click on the "add another public key" link
3.  Copy and paste the contents of `/path/to/git/home/.ssh/id_dsa.pub`
4.  Assign it a descriptive name like "<git-backups@git.example.com>"

## See also

-   <http://github.com/guides/providing-your-ssh-key>

## Optional setup

I also added a block like this to my `~/.ssh/config`; it's not strictly necessary but I think it's nice to be explicit:

    Host github.com
      IdentityFile /path/to/git/home/.ssh/id_dsa
      HostName github.com
      User git

With this set-up in place you have the option of specifying the repository using:

    github.com:wincent/Wikitext.git

Instead of the longer:

    git@github.com:wincent/Wikitext.git

# Creating the repository on GitHub

1.  Log in to [GitHub](https://github.com/)
2.  Under "Your Repositories", click "New Repository"
3.  Fill out the "Project Name", "Description" and "Homepage URL" fields:
    1.  "Project Name", for example, might be something like "Wikitext"
    2.  "Description" could be something like "Mirror of the official Wikitext repository at git.typechecked.net"
    3.  "Homepage URL", for example, could be something like <http://wikitext.rubyforge.org/>
4.  Turn off the "Wiki", "Issues" and "Downloads" features (that functionality is already provided on the wincent.com site)

# Setting up a `README` file

If your tree includes an optional `README` at the top-level it will be displayed by GitHub. Various formats like `README.rdoc`, `README.txt` will also work ([see here for details](http://github.com/guides/readme-formatting)).

# Pushing to GitHub for the first time

In the source repository, some initial setup is required.

For example, for GitHub username "wincent" and repo "Wikitext.git":

    # sudo -u user git remote add --mirror github git@github.com:wincent/Wikitext.git

That's the incantation that we'll eventually use, but for now we'll do it without the `--mirror` switch just to demonstrate what happens:

    # sudo -u user git remote add github git@github.com:wincent/Wikitext.git

(We run as the [Git](/wiki/Git) user to that any files, if they need to be created, have the correct ownership. Later on we'll see how adding the `--mirror` switch gives us the ideal behaviour for a purely backup repository.)

We can then do:

    # sudo -u user git push github master

Or even:

    # sudo -u user git push --all github
    # sudo -u user git push --tags github

If this is the first time you've pushed you'll see something like.

    The authenticity of host 'github.com (65.74.177.129)' can't be established.
    RSA key fingerprint is 16:27:ac:a5:76:28:2d:36:63:1b:56:4d:eb:df:a6:48.
    Are you sure you want to continue connecting (yes/no)? yes
    Warning: Permanently added 'github.com,65.74.177.129' (RSA) to the list of known hosts.

If you see an error like the following, it's likely that you have some kind of problem with your `PATH`:

    fatal: exec pack-objects failed.
    error: pack-objects died with strange error
    error: failed to push some refs to 'git@github.com:wincent/Wikitext.git'

This is not the first time I've had problems with [Git](/wiki/Git) as a result of my decision to install it under `/usr/local/` rather than `/usr/` (see "[Upgrading to Git 1.5.4](/wiki/Upgrading_to_Git_1.5.4)"). The problem here is that `sudo` can find and run the `git` command because `/usr/local/bin` is in the `PATH` of the user running `sudo`, but `git` running as the [Git](/wiki/Git) user itself cannot find `git-pack-objects` because it is running with an emaciated `PATH` (`/bin:/usr/bin`).

Adding `/usr/local/bin` to the `PATH` solves the problem. With the following in `/path/to/git/home/.bashrc`:

    PATH=/usr/local/bin:$PATH
    export PATH

The push now works:

    # sudo -s -H -u user
    $ echo $PATH
    /usr/local/bin:/usr/bin:/bin
    $ git push github master
    Counting objects: 2840, done.
    Compressing objects: 100% (849/849), done.
    Writing objects: 100% (2840/2840), 4.05 MiB | 1736 KiB/s, done.
    Total 2840 (delta 2015), reused 2680 (delta 1904)
    To git@github.com:wincent/Wikitext.git
     * [new branch]      master -> master

Note how we need a shell (`-s`) which sources the `.bashrc` in order for this `PATH` setting to come into effect.

## Updating all branches and tags at once

The `git-push` [man](/wiki/man) page describes the handy `--mirror` option that perfectly fits our usage model:

> Instead of naming each ref to push, specifies that all refs under `$GIT_DIR/refs/` (which includes but is not limited to `refs/heads/`, `refs/remotes/`, and `refs/tags/`) be mirrored to the remote repository. Newly created local refs will be pushed to the remote end, locally updated refs will be force updated on the remote end, and deleted refs will be removed from the remote end. This is the default if the configuration option `remote.<remote>.mirror` is set.

The `--mirror` option has the advantage that the [GitWeb](/wiki/GitWeb) _won't_ show tags for the `github/master` (etc) refs.

So let's undo our former `git remote` invocation:

    sudo -u user git remote rm github

And then redo it:

    sudo -u user git remote add --mirror github git@github.com:wincent/Wikitext.git

Alternatively, we could just:

    sudo -u user git config remote.github.mirror true

Check our work:

    cat config

Shows:

    [core]
    	repositoryformatversion = 0
    	filemode = true
    	bare = true
    [remote "github"]
    	url = git@github.com:wincent/Wikitext.git
    	fetch = +refs/*:refs/*
    	mirror = true

We can also check using:

    sudo -u user git remote show github

Shows this output:

    * remote github
      URL: git@github.com:wincent/Wikitext.git
      Stale tracking branches (use 'git remote prune')
        antlr maint ragel refs/tags/0.1 refs/tags/0.2 refs/tags/0.3 refs/tags/0.4 refs/tags/0.5 refs/tags/0.6 refs/tags/1.0 refs/tags/1.0.1 refs/tags/1.0.2 refs/tags/1.0.3 refs/tags/1.1 refs/tags/1.1.1 refs/tags/1.2 refs/tags/1.2.1 refs/tags/1.3.0 refs/tags/1.3.1 refs/tags/1.3.2 refs/tags/1.4.0 refs/tags/1.4.1 refs/tags/1.5.0 refs/tags/1.5.1 refs/tags/1.5.2 refs/tags/1.5.3 refs/tags/1.6 refs/tags/1.7
      Tracked remote branch
        master

**Note:** We don't actually want to follow the advice here to prune the stale tracking branches; that would remove all tags and all branches but the master branch (easily restored iwth a `git push --all` and `git push --tags` from the local development machine, but best to avoid the unnecessary chore). Instead we just push:

    # sudo -H -s -u user
    $ git push github

# Setting up [cron](/wiki/cron)-based automation

Start editing the crontab:

    $ crontab -e

And give it content something like this:

    MAILTO="win@wincent.com"
    PATH=/usr/local/bin:/bin:/usr/bin
    @hourly ${HOME}/tools/github-mirror.sh

Where `${HOME}/tools/github-mirror.sh` is a simple shell script that looks something like this:

    #!/bin/sh
    # github-mirror.sh
    # Copyright 2009 Wincent Colaiuta.
    #
    # crontab notes:
    # ==============
    #
    # This script is intended to be run using cron once per hour using a
    # crontab entry like this one:
    #
    #   MAILTO="person@example.com"
    #   @hourly    ${HOME}/bin/github-mirror.sh
    #
    # The script should run as the owner of the repositories:
    #
    #   sudo crontab -u git -e

    #
    # Configuration
    #

    PUBLIC_REPOS=/path/to/git/home/public/repos

    #
    # Functions
    #

    do_push()
    {
      for REPO in $1/*.git; do
        (cd $REPO && git push github)
      done
    }

    #
    # Main
    #

    set -e

    do_push "${PUBLIC_REPOS}"

# Inspecting the mirror

-   <http://github.com/wincent/Wikitext/tree/master>

# See also

-   [Setting up backup (mirror) repositories on Gitorious](/wiki/Setting_up_backup_%28mirror%29_repositories_on_Gitorious)
