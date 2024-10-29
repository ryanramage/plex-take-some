const fs = require('fs')
const path = require('path')
const async = require('async')
const updatePlexRating = require('./updatePlexRating')

module.exports = (config) => new Promise((resolve) => {
  const files = fs.readdirSync(config.saveDir)
  const musicFiles = files.filter(file => 
    ['.mp3', '.m4a', '.flac', '.wav'].includes(path.extname(file).toLowerCase())
  )

  console.log(`Found ${musicFiles.length} music files to process`)
  async.eachLimit(musicFiles, 2, (file, cb) => {
    updatePlexRating(config, file).then(result => {
      if (!result.rating) return cb()
      console.log(`Updated ${file}: Rating=${result.rating}${result.mood ? ', Mood=' + result.mood : ''}`)
      return cb()
    })
  }, () => {
    console.log('Rating processing complete')
    resolve()
  })
})

