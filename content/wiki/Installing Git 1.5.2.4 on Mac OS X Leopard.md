---
tags: git wiki
title: Installing Git 1.5.2.4 on Mac OS X Leopard
---

Notes made while installing [Git 1.5.2.4](/wiki/Git_1.5.2.4) on [Mac OS X](/wiki/Mac_OS_X) [Leopard](/wiki/Leopard).

# Installation

    # build expat dependency
    curl -O http://surfnet.dl.sourceforge.net/sourceforge/expat/expat-2.0.1.tar.gz
    tar xzvf expat-2.0.1.tar.gz
    cd expat-2.0.1
    ./configure
    make
    make check
    sudo make install
    cd ..

    # build GPG for signature verification
    curl -O ftp://ftp.gnupg.org/gcrypt/gnupg/gnupg-1.4.7.tar.bz2
    openssl sha1 gnupg-1.4.7.tar.bz2
    tar xjvf gnupg-1.4.7.tar.bz2
    cd gnupg-1.4.7
    ./configure
    make
    make check
    sudo make install
    cd ..

    # copy GPG files from Tiger install
    mkdir -m 700 ~/.gnupg
     cp ${PATH_TO_TIGER_HOME_FOLDER}/.gnupg/*gpg* ~/.gnupg/

    # git
    curl -O http://kernel.org/pub/software/scm/git/git-1.5.2.4.tar.bz2 \
         -O http://kernel.org/pub/software/scm/git/git-1.5.2.4.tar.bz2.sign
    gpg --verify git-1.5.2.4.tar.bz2.sign git-1.5.2.4.tar.bz2
    tar xjvf git-1.5.2.4.tar.bz2
    cd git-1.5.2.4
    make prefix=/usr/local all
    make prefix=/usr/local test
    echo $?
    sudo make prefix=/usr/local install
    cd ..

    # manpages
    curl -O  http://www.kernel.org/pub/software/scm/git/git-manpages-1.5.2.4.tar.bz2 \
         -O http://www.kernel.org/pub/software/scm/git/git-manpages-1.5.2.4.tar.bz2.sign
    gpg --verify git-manpages-1.5.2.4.tar.bz2.sign git-manpages-1.5.2.4.tar.bz2
    sudo tar xjv -C /usr/local/share/man -f git-manpages-1.5.2.4.tar.bz2

# Configuration

I also had to undertake some of the configuration described in "[Git quickstart](/wiki/Git_quickstart)":

    # personalize these with your own name and email address
    git config --global user.name "Wincent Colaiuta"
    git config --global user.email "example@example.com"

    # colorize output
    git config --global color.status auto
    git config --global color.diff auto
    git config --global color.branch auto

    # shortcut aliases
    git config --global alias.st status
    git config --global alias.ci commit
    git config --global alias.co checkout

    # use Apple opendiff (FileMerge) for resolving conflicts
    git config --global merge.tool opendiff

    # this so I can submit patches using git send-email
    git config --global sendemail.smtpserver smtp.example.com
    git config --global sendemail.aliasesfile ~/.gitaliases
    git config --global sendemail.aliasfiletype mailrc

    # shortcut aliases for submitting patches for Git itself
    echo "alias git git@vger.kernel.org" >> ~/.gitaliases
    echo "alias junio gitster@pobox.com" >> ~/.gitaliases

    # turn on new 1.5 features which break backwards compatibility
    git config --global core.legacyheaders false
    git config --global repack.usedeltabaseoffset true

I added these aliases to my `~/.bash_profile`:

    # show difference between the HEAD and the index
    alias staged="git diff --cached"

    # show difference between working tree and the index
    alias unstaged="git diff"

    # show staged and unstaged changes (what would be committed with "git commit -a")
    alias both="git diff HEAD"

I set up a global ignores file:

    git config --global core.excludesfile ~/.gitignore
    echo ".DS_Store" >> ~/.gitignore

And a basic `.gitk` file:

    cat > ~/.gitk <<EOF
    set mainfont {Monaco 10}
    set textfont {Monaco 10}
    set uifont {Monaco 10}
    EOF

And finally appropriate additions to my `~/.ssh/config` file, after copying over `my_git_private_key` from my Tiger partition:

    cat >> ~/.ssh/config <<EOF
    Host git.example.com
      IdentityFile /Users/wincent/.ssh/my_git_private_key
      HostName git.example.com
      User git
    EOF
