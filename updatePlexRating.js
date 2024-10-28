const path = require('path')
const request = require('request')
const rating = require('./rating')

function updatePlexRating(config, file) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(config.saveDir, file)
    const skip = (message) => {
      console.log(`Skipping ${file}: ${message}`)
      resolve({ file })
    }
    
    console.log('ryans test', fullPath)
    rating(fullPath)
      .then(({ rating, mood, plexId }) => {
        if (!plexId) return skip('No Plex ID found in file, skipping')
        if (!rating) return skip('No rating found in file')
          
        
        // Construct Plex API URL for rating update using plexId from ID3 tag
        const url = `http://${config.host}${config.plexPort ? ':' + config.plexPort : ''}/library/metadata/${plexId}/rate`
        const qs = {
          'X-Plex-Token': config.token,
          'rating': rating
        }

        console.log(url)
        request.put({ url, qs }, (err, response) => {
          if (err) return reject(err)
          if (response.statusCode !== 200) {
            return reject(new Error(`Failed to update rating: ${response.statusCode}`))
          }
          resolve({ file, rating, mood })
        })
      })
      .catch(err => reject(err))
  })
}

module.exports = updatePlexRating
