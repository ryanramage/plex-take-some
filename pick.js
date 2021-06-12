// given an array of media items, return a random subset up to maxBytes

const shuffle = require('lodash.shuffle')

module.exports = (items, maxBytes) => {
  let currentBytes = 0
  let subset = []
  const random = shuffle(items)

  let i = 0

  while (currentBytes < maxBytes && i < random.length) {
    let pick = random[i++]
    let nextBytes = currentBytes + pick.size
    if (nextBytes < maxBytes) {
      currentBytes = nextBytes
      subset.push(pick)
    }
  }
  return {subset, size: currentBytes}
}
