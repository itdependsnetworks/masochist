---
tags: git updates wiki
title: Updating to Git 1.6.1.1
---

I didn't update my local [Mac OS X](/wiki/Mac_OS_X) install because 1.6.1.1 still has failing tests on Mac OS X.

    *** t2300-cd-to-toplevel.sh ***
    *   ok 1: at physical root
    *   ok 2: at physical subdir
    * FAIL 3: at symbolic root

    			(
    				cd 'symrepo' &&
    				. git-sh-setup &&
    				cd_to_toplevel &&
    				[ "$(/bin/pwd)" = "$TOPLEVEL" ]
    			)

    * FAIL 4: at symbolic subdir

    			(
    				cd 'subdir-link' &&
    				. git-sh-setup &&
    				cd_to_toplevel &&
    				[ "$(/bin/pwd)" = "$TOPLEVEL" ]
    			)

    * FAIL 5: at internal symbolic subdir

    			(
    				cd 'internal-link' &&
    				. git-sh-setup &&
    				cd_to_toplevel &&
    				[ "$(/bin/pwd)" = "$TOPLEVEL" ]
    			)

    * failed 3 among 5 test(s)
    make[2]: *** [t2300-cd-to-toplevel.sh] Error 1
    make[1]: *** [all] Error 2
    make: *** [test] Error 2

The fix is already in the "next" branch, but hasn't made it into a released version of [Git](/wiki/Git) yet:

    commit dd6c1360b22ee89cb179e2a1fface98ecbeb7b3e
    Author: Marcel M. Cary <marcel@oak.homeunix.org>
    Date:   Tue Dec 30 07:10:24 2008 -0800

        git-sh-setup: Fix scripts whose PWD is a symlink to a work-dir on OS X

        On Mac OS X and possibly BSDs, /bin/pwd reads PWD from the environment if
        available and shows the logical path by default rather than the physical
        one.

        Unset PWD before running /bin/pwd in both cd_to_toplevel and its test.

        Still use the external /bin/pwd because in my Bash on Linux, the builtin
        pwd prints the same result whether or not PWD is set.

        Signed-off-by: Marcel M. Cary <marcel@oak.homeunix.org>
        Tested-by: Greg Hurrell <greg@hurrell.net> (on Mac OS X 10.5.5)
        Tested-by: Marcel Koeppen <git-dev@marzelpan.de> (on Mac OS X 10.5.6)
        Signed-off-by: Junio C Hamano <gitster@pobox.com>

    diff --git a/git-sh-setup.sh b/git-sh-setup.sh
    index f07d96b..2142308 100755
    --- a/git-sh-setup.sh
    +++ b/git-sh-setup.sh
    @@ -96,7 +96,7 @@ cd_to_toplevel () {
                    ..|../*|*/..|*/../*)
                            # Interpret $cdup relative to the physical, not logical, cwd.
                            # Probably /bin/pwd is more portable than passing -P to cd or pwd.
    -                       phys="$(/bin/pwd)/$cdup"
    +                       phys="$(unset PWD; /bin/pwd)/$cdup"
                            ;;
                    *)
                            # There's no "..", so no need to make things absolute.
    diff --git a/t/t2300-cd-to-toplevel.sh b/t/t2300-cd-to-toplevel.sh
    index beddb4e..e42cbfe 100755
    --- a/t/t2300-cd-to-toplevel.sh
    +++ b/t/t2300-cd-to-toplevel.sh
    @@ -10,12 +10,12 @@ test_cd_to_toplevel () {
                            cd '"'$1'"' &&
                            . git-sh-setup &&
                            cd_to_toplevel &&
    -                       [ "$(/bin/pwd)" = "$TOPLEVEL" ]
    +                       [ "$(unset PWD; /bin/pwd)" = "$TOPLEVEL" ]
                    )
            '
     }

    -TOPLEVEL="$(/bin/pwd)/repo"
    +TOPLEVEL="$(unset PWD; /bin/pwd)/repo"
     mkdir -p repo/sub/dir
     mv .git repo/
     SUBDIRECTORY_OK=1
