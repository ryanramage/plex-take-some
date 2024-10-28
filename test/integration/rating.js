const rating  = require('../../rating')

const file = '/Users/placertwo/Downloads/plextake/01_-_eraser.mp3'

const run = async () => {
  const results = await rating(file)
  console.log(results)
}
run()
