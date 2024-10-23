#!/usr/bin/env node
const _get = require('lodash.get')
const request = require('request')
const argv = require('minimist')(process.argv.slice(2))
const parseString = require('xml2js').parseString
const bytes = require('bytes')
const pick = require('./pick')
const download = require('./download')

const options = require('rc')('plextakesome', {
  host: 'plex.host.com',
  playlist: 1000,
  token: 'XXXXXXXXX',
  plexPort: null,
  saveDir: '/home/someone/download',
  maxBytes: '1gb'
})
let hostname = `${options.host}`
if (options.plexPort) hostname = `${hostname}:${options.plexPort}`

if (argv.l) {
  // List playlists
  let url = `http://${hostname}/playlists`
  let qs = {
    'X-Plex-Token': options.token
  }
  request({url, qs}, (err, resp, body) => {
    if (err) return console.error('Error fetching playlists:', err)
    parseString(body, (err, result) => {
      if (err) return console.error('Error parsing response:', err)
      const playlists = _get(result, 'MediaContainer.Playlist', [])
      console.log('\nAvailable Playlists:')
      console.log('-------------------')
      playlists.forEach(playlist => {
        console.log(`ID: ${_get(playlist, '$.ratingKey')} - ${_get(playlist, '$.title')}`)
      })
      console.log()
    })
  })
} else {
  // Download tracks
  let maxBytes = bytes.parse(options.maxBytes)
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
      let partId = _get(media, 'Part[0].$.id')
      items.push({title, artist, file, size, partId})
    })
    let {subset} = pick(items, bytes.parse(options.maxBytes))
    download(options, subset, (err, files) => {
      if (err) return console.log('an error occurred', err)
      console.log(`download complete: ${options.saveDir}`)
      console.log(files)
    })
  })
})}
