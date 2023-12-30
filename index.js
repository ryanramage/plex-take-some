#!/usr/bin/env node
const _get = require('lodash.get')
const request = require('request')
const parseString = require('xml2js').parseString
const bytes = require('bytes')
const pick = require('./pick')
const download = require('./download')

const options = require('rc')('plextakesome', {
  host: 'plex.host.com',
  plexPort: null,
  playlist: 1000,
  token: 'XXXXXXXXX',
  sshPort: 22,
  username: 'shelluser',
  password: 'password',
  saveDir: '/home/someone/download',
  maxBytes: '1gb'
})
let maxBytes = bytes.parse(options.maxBytes)
let hostname = `${options.host}`
if (options.plexPort) hostname = `${hostname}:${options.plexPort}`
let url = `http://${hostname}/playlists/${options.playlist}/items`
let qs = {
  'X-Plex-Token': options.token
}
let opts = {url, qs}
request(opts, (err, resp, body) => {
  parseString(body, (err, result) => {
    let rows = _get(result, 'MediaContainer.Track', [])
    let items = []
    rows.forEach(row => {
      let title = _get(row, '$.title')
      let artist = _get(row, '$.grandparentTitle')
      let media = _get(row, 'Media[0]')
      let file = _get(media, 'Part[0].$.file')
      let size = Number(_get(media, 'Part[0].$.size'))
      items.push({title, artist, file, size})
    })
    let {subset} = pick(items, bytes.parse(options.maxBytes))
    download(options, subset, (err, files) => {
      if (err) return console.log('an error occurred', err)
      console.log(`download complete: ${options.saveDir}`)
      console.log(files)
    })
  })
})
