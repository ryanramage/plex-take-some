const rating  = require('../../rating')
const updatePlexRating = require('../../updatePlexRating')

// const file = '01_-_eraser.mp3'
const file = 'That!_Feels_Good!_Freak_Me_Now.mp3'
const options = require('rc')('plextakesome', {
  host: 'plex.host.com',
  playlist: 1000,
  token: 'XXXXXXXXX',
  plexPort: null,
  saveDir: '/home/someone/download',
  maxBytes: '1gb',
  list: null,
  clearSaveDir: false,
  rating: false
})
let hostname = `${options.host}`
if (options.plexPort) hostname = `${hostname}:${options.plexPort}`

const run = async () => {
  const results = await updatePlexRating(options, file)
  console.log(results)
}
run()
