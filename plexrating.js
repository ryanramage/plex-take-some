const fs = require('fs')
const path = require('path')
const async = require('async')
const updatePlexRating = require('./updatePlexRating')

module.exports = async function processRatings(config) {
  const files = fs.readdirSync(config.saveDir)
  const musicFiles = files.filter(file => 
    ['.mp3', '.m4a', '.flac', '.wav'].includes(path.extname(file).toLowerCase())
  )

  console.log(`Found ${musicFiles.length} music files to process`)
  
  await new Promise((resolve, reject) => {
    async.eachLimit(musicFiles, 2, async (file, callback) => {
      try {
        const result = await updatePlexRating(config, file)
        if (result.rating) {
          console.log(`Updated ${file}: Rating=${result.rating}${result.mood ? ', Mood=' + result.mood : ''}`)
        }
        callback()
      } catch (err) {
        console.error(`Failed to process ${file}:`, err.message)
        callback(err)
      }
    }, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}
