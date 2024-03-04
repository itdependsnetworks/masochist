---
tags: apache sendmail cyrus ssl wiki
title: SSL certificate renewal notes 2012
---

I've been using [RapidSSL](/wiki/RapidSSL) for my [SSL](/wiki/SSL) certificates for a few years now, using [ServerTastic](http://www.servertastic.com/) because it's been the cheapest reseller (\$50 for a 5/year renewal). Right now I have one cert for wincent.com and another for secure.wincent.com (buying two separate certs is still considerably cheaper than getting a wildcard cert, although one day I'll probably cave in and get a wildcard cert in order to gracefully handle and redirect HTTPS requests coming in to wincent.com and possibly other subdomains as well).

This year I was forced into renewing a little early because Chrome started complaining about the signature algorithm used on the older of my two certs (the certificate in question was for secure.wincent.com, and set to expire on 23 May 2013; just under 11 months from now). I had originally thought that by the time it expired I might have migrated all my SSL traffic onto wincent.com, but that hasn't happened. This is the first time I've been "bitten" by my selection of cheaper certificates.

This time I went with [Namecheap](http://namecheap.com), as they offered a marginally better deal (\$9.49/year for 4 years).

In many ways the process here was similar to the last time I renewed this certificate (see "[SSL certificate renewal notes 2008](/wiki/SSL_certificate_renewal_notes_2008)"). The only catches were that, since last time:

-   RapidSSL started using an intermediate CA (Certificate Authority) to sign the issued certificate, rather than directly signing it with the root CA like they used to.
-   Namecheap refuses CSRs (Certificate Signing Requests) made with 1024-bit keys, requiring a minimum of a 2048-bit key

Things mostly "just work" in any case; it was only with [Cyrus](/wiki/Cyrus) that I had to make adjustments.

As before, the basic process for renewal is:

1.  Go to Namecheap
2.  Go through the checkout process
3.  Receive email with link to page where you submit your CSR (Certificate Signing Request)
4.  Generate the CSR and paste it into the web page from the previous step
5.  Receive another email requesting approval to generate a new certificate
6.  Install the new certificate for [Apache](/wiki/Apache), [sendmail](/wiki/sendmail) and [Cyrus](/wiki/Cyrus)

# Generating a new private key

Most places will issue scary warnings about generating unencrypted private keys, but in practice that's exactly what you'll need if you want to be able to bring up services in an automated fashion (without having to enter a passphrase to decrypt the key). If you're not a bank, then having correct/conservative ownership and permissions on the key file, combined with staying up to date with security practices, is probably the right tradeoff.

It's possible to create such a key by omitting the `-des3` option:

    # go to dir containing Apache certs
    cd /data/etc/httpd/ssl

    # generate new key, with more bits
    openssl genrsa --out ssl.key.rapidssl.2012 4096

If you forget to do that, you can also remove the passphrase as shown:

    # generate new key, encrypted like everybody says you should...
    openssl genrsa -des3 -out ssl.key.rapidssl.2012 4096

    # tighten perms otherwise SSL refuses to touch the key
    chmod 600 ssl.key.rapidssl.2012

    # change or strip the passphrase
    ssh-keygen -p -f ssl.key.rapidssl.2012

    # lock down
    chmod 400 ssl.key.rapidssl.2012

# Generating the CSR (Certificate Signing Request)

    # gen new csr
    openssl req -new -key ssl.key.rapidssl.2012 -out ssl.csr.rapidssl.2012

I answered the questions as follows:

    You are about to be asked to enter information that will be incorporated
    into your certificate request.
    What you are about to enter is what is called a Distinguished Name or a DN.
    There are quite a few fields but you can leave some blank
    For some fields there will be a default value,
    If you enter '.', the field will be left blank.
    -----
    Country Name (2 letter code) [GB]:AU
    State or Province Name (full name) [Berkshire]:South Australia
    Locality Name (eg, city) [Newbury]:Glenelg South
    Organization Name (eg, company) [My Company Ltd]:wincent.com
    Organizational Unit Name (eg, section) []:
    Common Name (eg, your name or your server's hostname) []:secure.wincent.com
    Email Address []:win@wincent.com

    Please enter the following 'extra' attributes
    to be sent with your certificate request
    A challenge password []:
    An optional company name []:

It's a good idea to check new csr against old one; making sure the info looks sane

    openssl req -noout -text -in ssl.csr.rapidssl.2010
    openssl req -noout -text -in ssl.csr.rapidssl.2012

# Installing the new cert and intermediate CA for [Apache](/wiki/Apache)

Once I received the new cert and intermediate CA cert, I inspected the CA cert:

    # inspect new intermediate cert
    openssl x509 -in ca.rapidssl.2012 -noout -text -purpose

And then symlinked the new files into place:

    lrwxrwxrwx 1 root root   20 2012-06-30 21:05 ca.crt -> ca.crt.rapidssl.2012
    -r-------- 1 root root 1850 2012-06-30 13:27 ca.crt.comodo.2004
    -r-------- 1 root root 1391 2012-06-30 13:24 ca.crt.rapidssl.2012
    -rw-r--r-- 1 root root 8641 2010-03-30 12:38 ssl.conf
    lrwxrwxrwx 1 root root   21 2012-06-30 21:06 ssl.crt -> ssl.crt.rapidssl.2012
    -r-------- 1 root root 1827 2008-03-28 08:26 ssl.crt.comodo.2004
    -r-------- 1 root root 1212 2008-03-28 08:26 ssl.crt.rapidssl.2007
    -r-------- 1 root root 1212 2008-04-23 07:08 ssl.crt.rapidssl.2008
    -r-------- 1 root root 2199 2012-06-30 13:23 ssl.crt.rapidssl.2012
    -r-------- 1 root root  660 2008-03-28 08:26 ssl.csr.comodo.2004
    -r-------- 1 root root  688 2008-03-28 08:26 ssl.csr.rapidssl.2007
    -r-------- 1 root root  708 2008-04-23 06:51 ssl.csr.rapidssl.2008
    -r-------- 1 root root 1756 2012-06-30 13:20 ssl.csr.rapidssl.2012
    lrwxrwxrwx 1 root root   21 2012-06-30 21:07 ssl.key -> ssl.key.rapidssl.2012
    -r-------- 1 root root  888 2008-03-28 08:26 ssl.key.comodo.2004
    -r-------- 1 root root  887 2008-03-28 08:26 ssl.key.rapidssl.2007
    -r-------- 1 root root 3243 2012-06-30 13:18 ssl.key.rapidssl.2012

Then it was time to test the config and verify that everything worked in the browser(s) of interest:

    apachectl configtest
    apachectl graceful

# Sendmail

Sendmail is configured to look in a different place for TLS files (see `/etc/mail/sendmail.mc` for exact details):

    cd /etc/pki/tls/certs
    cp /data/etc/httpd/ssl/ca.crt.rapidssl.2012 .
    cp /data/etc/httpd/ssl/ssl.key.rapidssl.2012 sendmail.key.rapidssl.2012
    cp /data/etc/httpd/ssl/ssl.crt.rapidssl.2012 sendmail.pem.rapidssl.2012

    # generate hash of certificate subject name
    openssl x509 -hash -in ca.crt.rapidssl.2012 -inform PEM -noout
    ln -s ca.crt.rapidssl.2012 2f2c2f7c.0

    # confirm that all is well
    openssl verify sendmail.pem.rapidssl.2012

Again, symlink and set appropriate permissions:

    lrwxrwxrwx 1 root root     20 2012-06-30 15:45 2f2c2f7c.0 -> ca.crt.rapidssl.2012
    lrwxrwxrwx 1 root root     20 2012-06-30 15:47 74c26bd0.0 -> ca.crt.rapidssl.2010
    -rw-r--r-- 1 root root 517016 2007-10-15 11:20 ca-bundle.crt
    -r-------- 1 root root    948 2010-02-18 20:16 ca.crt.rapidssl.2010
    -r-------- 1 root root   1391 2012-06-30 15:32 ca.crt.rapidssl.2012
    -rw------- 1 root root   1476 2010-02-16 09:24 localhost.crt
    -rwxr-xr-x 1 root root    610 2007-10-15 17:55 make-dummy-cert
    -rw-r--r-- 1 root root   2240 2007-10-15 17:55 Makefile
    lrwxrwxrwx 1 root root     26 2012-06-30 15:47 sendmail.key -> sendmail.key.rapidssl.2012
    -r-------- 1 root root    887 2012-06-30 15:29 sendmail.key.rapidssl.2007
    -r-------- 1 root root   3243 2012-06-30 15:42 sendmail.key.rapidssl.2012
    lrwxrwxrwx 1 root root     26 2012-06-30 15:48 sendmail.pem -> sendmail.pem.rapidssl.2012
    -r-------- 1 root root   1212 2012-06-30 15:29 sendmail.pem.rapidssl.2008
    -r-------- 1 root root   2199 2012-06-30 15:42 sendmail.pem.rapidssl.2012

At this point we can restart sendmail and test:

    service sendmail restart

    # without the CApath, you'll get a warning about a
    # self-signed certificate being in the chain
    # http://stackoverflow.com/questions/4103472
    openssl s_client -starttls smtp -connect secure.wincent.com:25 -CApath /etc/pki/tls/certs

# Cyrus

As noted earlier, Cyrus is the one thing that required some additional hoop-jumping. Specifically, I had to make a bundle certificate that was the concatenation of the server cert and the intermediate CA cert

    cd /etc/pki/cyrus-imapd
    cp /data/etc/httpd/ssl/ssl.key.rapidssl.2012 cyrus-imapd.key.rapidssl.2012
    cp /data/etc/httpd/ssl/ssl.crt.rapidssl.2012 cyrus-imapd.pem.rapidssl.2012

After setting up the bundled cert file, symlinks, permissions/ownership:

    -r-------- 1 cyrus root 3590 2012-06-30 19:28 cyrus-imapd-bundle.pem.rapidssl.2012
    lrwxrwxrwx 1 root  root   29 2012-06-30 19:24 cyrus-imapd.key -> cyrus-imapd.key.rapidssl.2012
    -r-------- 1 cyrus root  887 2012-06-30 16:04 cyrus-imapd.key.rapidssl.2007
    -r-------- 1 cyrus root 3243 2012-06-30 16:05 cyrus-imapd.key.rapidssl.2012
    lrwxrwxrwx 1 root  root   36 2012-06-30 19:24 cyrus-imapd.pem -> cyrus-imapd-bundle.pem.rapidssl.2012
    -r-------- 1 cyrus root 1212 2012-06-30 16:05 cyrus-imapd.pem.rapidssl.2008
    -r-------- 1 cyrus root 2199 2012-06-30 16:20 cyrus-imapd.pem.rapidssl.2012

The relevant lines from `/etc/imapd.conf` look like this:

    tls_cert_file: /etc/pki/cyrus-imapd/cyrus-imapd.pem
    tls_key_file: /etc/pki/cyrus-imapd/cyrus-imapd.key
    tls_ca_file: /etc/pki/tls/certs/ca-bundle.crt
    tls_ca_path: /etc/pki/tls/certs

And we can restart Cyrus:

    service cyrus-imapd restart

And verify in [Mail.app](/wiki/Mail.app) and on the [command line](/wiki/command_line):

    # test secure IMAP
    openssl s_client -connect secure.wincent.com:993  -CApath /etc/pki/tls/certs

    # test secure POP
    openssl s_client -connect secure.wincent.com:995  -CApath /etc/pki/tls/certs

# nginx

My [nginx](/wiki/nginx) instance is running with a different hostname and hence a different certificate, so there was nothing to do this time. See "[SSL certificate renewal notes 2010](/wiki/SSL_certificate_renewal_notes_2010)" for an example of a certificate update involving nginx.
