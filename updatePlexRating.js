const path = require('path')
const request = require('request')
const rating = require('./rating')

function updatePlexRating(config, file) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(config.saveDir, file)
    const skip = () => {
      resolve({ file })
    }
    
    rating(fullPath)
      .then(({ rating, mood, plexId }) => {
        if (!plexId) return skip('No Plex ID found in file, skipping')
        if (!rating) return skip('No rating found in file')
          
        let fullRating = rating
        if (fullRating > 10) fullRating = 10
        
        // Construct Plex API URL for rating update using plexId from ID3 tag
        const url = `http://${config.host}${config.plexPort ? ':' + config.plexPort : ''}/:/rate`
        const qs = {
          'X-Plex-Token': config.token,
          'rating': fullRating, // 10-point scale
          'identifier': 'com.plexapp.plugins.library',
          'key': `${plexId}`
        }
        const headers = {
          'X-Plex-Client-Identifier': 'plex-take-some'
        }

        const updatePromises = []

        // Add rating update request
        updatePromises.push(new Promise((resolveRating, rejectRating) => {
          request.put({ url, qs, headers }, (err, response) => {
            if (err) return rejectRating(err)
            if (response.statusCode !== 200) {
              return rejectRating(new Error(`Failed to update rating: ${response.statusCode}`))
            }
            resolveRating()
          })
        }))

        // Add mood update request if mood exists
        if (mood) {
          const moodUrl = `http://${config.host}${config.plexPort ? ':' + config.plexPort : ''}/library/sections/1/all`
          const moodQs = {
            'X-Plex-Token': config.token,
            'type': 10,
            'includeExternalMedia': 1,
            'mood[0].tag.tag': mood,
            'id': plexId
          }
          
          updatePromises.push(new Promise((resolveMood, rejectMood) => {
            request.put({ url: moodUrl, qs: moodQs, headers }, (err, response) => {
              if (err) return rejectMood(err)
              if (response.statusCode !== 200) {
                return rejectMood(new Error(`Failed to update mood: ${response.statusCode}`))
              }
              resolveMood()
            })
          }))
        }

        // Wait for all updates to complete
        Promise.all(updatePromises)
          .then(() => resolve({ file, rating, mood }))
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}

module.exports = updatePlexRating
