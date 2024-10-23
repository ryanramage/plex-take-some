const request = require('request')
const fs = require('fs')
const async = require('async')

module.exports = (config, picks, done) => {
  console.log('starting downloads')
  async.mapLimit(picks, 1, (pick, cb) => download(config, pick, cb), (err, files) => {
    if (err) console.log('an error occurred:', err)
    done(err, files)
  })
}

function download(config, pick, done) {
  const file = pick.file.split('/').pop()
  const localPath = `${config.saveDir}/${file}`
  const downloadUrl = `http://${config.host}${config.plexPort ? ':' + config.plexPort : ''}/library/parts/${pick.partId}/file?X-Plex-Token=${config.token}`

  request(downloadUrl)
    .pipe(fs.createWriteStream(localPath))
    .on('finish', () => {
      console.log(`Finished downloading: ${file}`)
      done(null, file)
    })
    .on('error', (err) => done(err))
}
