const fs = require('fs')
const path = require('path')
const updatePlexRating = require('./updatePlexRating')

module.exports = async function processRatings(config) {
  const files = fs.readdirSync(config.saveDir)
  const musicFiles = files.filter(file => 
    ['.mp3', '.m4a', '.flac', '.wav'].includes(path.extname(file).toLowerCase())
  )

  console.log(`Found ${musicFiles.length} music files to process`)
  
  for (const file of musicFiles) {
    try {
      updatePlexRating(config, file).then(result => {
        if (!result.rating) return
        console.log(`Updated ${file}: Rating=${result.rating}${result.mood ? ', Mood=' + result.mood : ''}`)
      })
    } catch (err) {
      console.error(`Failed to process ${file}:`, err.message)
    }
  }
}
