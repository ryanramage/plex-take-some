const request = require('request')
const fs = require('fs')
const async = require('async')
const path = require('path')
const NodeID3 = require('node-id3')

module.exports = (config, picks, done) => {
  console.log('starting downloads')
  async.mapLimit(picks, 1, (pick, cb) => download(config, pick, cb), (err, files) => {
    if (err) console.log('an error occurred:', err)
    done(err, files)
  })
}

function sanitizeFilename(filename) {
  // Remove invalid characters and common problematic patterns
  return filename
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filesystem characters
    .replace(/\s+/g, '_')         // Replace spaces with underscores
    .replace(/^\.+/, '')          // Remove leading periods
    .replace(/\.+$/, '')          // Remove trailing periods
    .substring(0, 255)            // Limit length to 255 characters
}

function download(config, pick, done) {
  const file = sanitizeFilename(pick.file.split('/').pop())
  const localPath = path.join(config.saveDir, file)
  const downloadUrl = `http://${config.host}${config.plexPort ? ':' + config.plexPort : ''}/library/parts/${pick.partId}/file?X-Plex-Token=${config.token}`

  request(downloadUrl)
    .pipe(fs.createWriteStream(localPath))
    .on('finish', () => {
      // Write Plex ID to publisher tag
      const tags = {
        publisher: pick.ratingKey.toString()
      }
      NodeID3.write(tags, localPath, (err) => {
        if (err) {
          console.error(`Error writing ID3 tag: ${err}`)
          return done(err)
        }
        console.log(`Finished downloading: ${file}`)
        done(null, file)
      })
    })
    .on('error', (err) => done(err))
}
