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

You can use the --list flag to list all available playlists:
```
plex-take-some --list
```

Use the --rating flag to update Plex ratings based on audio file comments:
```
plex-take-some --rating
```
This will scan audio files in saveDir for comments in the format "!0-5 mood" (e.g. "!4 energetic") and update the corresponding Plex rating. The number (0-5) sets the Plex rating, and the mood is stored as a tag.

Without any flags, it will download files from your Plex server to the specified saveDir, up to the maxBytes limit.

Configuration Options:
- host: Your Plex server hostname
- playlist: The ID of the playlist to download from
- token: Your Plex authentication token
- plexPort: Port number for Plex server (default: 32400)
- saveDir: Local directory to save downloaded files
- maxBytes: Maximum total size to download (e.g., "1gb", "500mb")

Getting Your Plex Token:
There are several ways to get your Plex token:

1. From the Plex Web App:
   - Log into Plex Web App
   - Open the browser's developer tools (F12)
   - Go to the Network tab
   - Look for any request to plex.tv
   - Find the 'X-Plex-Token' parameter in the request headers or URL

2. From your Plex account page:
   - Log into plex.tv
   - Go to https://plex.tv/devices.xml
   - Enter your Plex login when prompted
   - Look for the 'token' attribute in the XML response

3. From the Plex desktop app:
   - Windows: Check %LOCALAPPDATA%\Plex Media Server\Logs\Plex Media Server.log
   - macOS: Check ~/Library/Logs/Plex Media Server/Plex Media Server.log
   - Find a line containing 'X-Plex-Token'
