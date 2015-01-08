# mac apache

## 1. Edit httpd.conf

```sh
$ sudo vim /etc/apache2/httpd.conf
```

uncomment this line

```
Include /private/etc/apache2/extra/httpd-vhosts.conf
```

save it with [shift] + [:]

## 2. Configure http-vhosts.conf

```sh
$ sudo vim /etc/apache2/extra/httpd-vhosts.conf
```

```sh
<VirtualHost *:80>
  ServerAdmin your@email.com
  DocumentRoot "/Users/{username}/{path}/mote"
  ServerName mote.lan
  ErrorLog "/Users/{username}/{path}/mote/error.log"
  CustomLog "/Users/{username}/{path}/mote/access.log" common
</VirtualHost>
```

## 3. Set a specific domain

```sh
$ sudo vim /etc/hosts
```

```sh
127.0.0.1 mote.lan
```

save it with [shift] + [:]

## 4. set permissions to folder

```sh
$ sudo chmod -R 747 /Users/{username}/{path}/mote/
```

## 5. restart apache

```sh
$ sudo apachectl restart
```