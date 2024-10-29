const path = require('path')
const request = require('request')
const rating = require('./rating')

function updatePlexRating(config, file) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(config.saveDir, file)
    const skip = (message) => {
      resolve({ file })
    }
    
    rating(fullPath)
      .then(({ rating, mood, plexId }) => {
        if (!plexId) return skip('No Plex ID found in file, skipping')
        if (!rating) return skip('No rating found in file')
          
        
        // Construct Plex API URL for rating update using plexId from ID3 tag
        const url = `http://${config.host}${config.plexPort ? ':' + config.plexPort : ''}/:/rate`
        const qs = {
          'X-Plex-Token': config.token,
          'rating': rating * 2, // Convert 5-star to 10-point scale
          'identifier': 'com.plexapp.plugins.library',
          'key': `${plexId}`
        }
        const headers = {
          'X-Plex-Client-Identifier': 'plex-take-some'
        }

        request.put({ url, qs, headers }, (err, response) => {
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
