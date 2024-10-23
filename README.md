Plex-Take-Some
===============

Just a little tool for me to download a subset of music playlist from my Plex server.

To use:

1. Create a .plextakesomerc file in your home directory with the following configuration:

```
host=plex.hostname
playlist=6107
token=XXXXXXXXX
plexPort=32400
saveDir=/Users/myhome/downloads
maxBytes=1gb
```

2. Run plex-take-some

This will download files from your Plex server to the specified saveDir, up to the maxBytes limit.

Configuration Options:
- host: Your Plex server hostname
- playlist: The ID of the playlist to download from
- token: Your Plex authentication token
- plexPort: Port number for Plex server (default: 32400)
- saveDir: Local directory to save downloaded files
- maxBytes: Maximum total size to download (e.g., "1gb", "500mb")
