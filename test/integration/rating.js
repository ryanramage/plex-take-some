const rating  = require('../../rating')

const file = '/Users/placertwo/Downloads/plextake/01_-_eraser.mp3'

const run = async () => {
  const results = await rating(file)
  console.log(results)
}
run()
const assert = require('assert')
const path = require('path')
const updatePlexRating = require('../../updatePlexRating')

describe('Plex Rating Integration', () => {
  const config = {
    host: process.env.PLEX_HOST || 'localhost',
    plexPort: process.env.PLEX_PORT || '32400',
    token: process.env.PLEX_TOKEN,
    saveDir: path.join(__dirname, '../fixtures')
  }

  before(() => {
    // Ensure we have required env vars
    assert(config.token, 'PLEX_TOKEN environment variable must be set')
  })

  it('should update rating for a valid music file', async () => {
    const result = await updatePlexRating(config, 'test-song.mp3')
    assert(result.rating, 'Rating should be returned')
    assert(result.file, 'File name should be returned')
  })

  it('should skip files without Plex ID', async () => {
    const result = await updatePlexRating(config, 'no-plex-id.mp3')
    assert.equal(result.rating, undefined)
  })

  it('should handle invalid files gracefully', async () => {
    try {
      await updatePlexRating(config, 'non-existent.mp3')
      assert.fail('Should have thrown an error')
    } catch (err) {
      assert(err instanceof Error)
    }
  })
})
