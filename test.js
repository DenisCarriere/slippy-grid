const grid = require('.')

const BBOX = [-180.0, -90.0, 180, 90]

/**
 * Grid
 */
describe('grid', () => {
  test('single', () => {
    const iterable = grid.single(BBOX, 3, 21)
    expect(iterable.next().value).toEqual([0, 0, 3])
  })

  test('bulk', () => {
    const iterable = grid.bulk(BBOX, 3, 5, 5)
    while (true) {
      const { value, done } = iterable.next()
      if (done) { break }
      expect(typeof value).toBe(typeof [])
    }
  })

  test('count', () => expect(grid.count(BBOX, 3, 21)).toBe(37773648480704))
  test('levels', () => expect(grid.levels(BBOX, 3, 21).length).toBe(19))
})
