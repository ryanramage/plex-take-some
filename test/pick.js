const test = require('tape')
const pick = require('../pick')

test('pick and dont go over', t => {
  let maxBytes = 5000
  let items = [
    {size: 1000, name: 'a'},
    {size: 400, name: 'b'},
    {size: 4833, name: 'c'},
    {size: 600, name: 'd'}
  ]
  let {subset, size} = pick(items, maxBytes)
  t.ok(size < maxBytes)
  t.end()
})
