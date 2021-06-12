Plex-Take-Some
===============

Just a little tool for me to download a subset of music playlist from my plex server.

To use:

 1. create a .plextakesome file in your home dir. Fill out the following values:

 ```
 cat ~/.plextakesomerc
host=plex.hostname
playlist=6107
token=XXXXXXXXX
sshPort=22
username=plexguest
password=YYYYYYYYYYY
saveDir=/Users/myhome/downloads
maxBytes=1gb
```

2. run plex-take-some

This will download from yout server to the saveDir up to maxBytes
