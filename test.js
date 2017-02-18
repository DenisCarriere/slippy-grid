const slippyGrid = require('.')

const BBOX = [-180.0, -90.0, 180, 90]

/**
 * Grid
 */
describe('grid', () => {
  test('single', () => {
    const iterable = slippyGrid.single(BBOX, 3, 21)
    expect(iterable.next().value).toEqual([0, 0, 3])
  })

  test('bulk', () => {
    const iterable = slippyGrid.bulk(BBOX, 3, 5, 5)
    while (true) {
      const { value, done } = iterable.next()
      if (done) { break }
      expect(typeof value).toBe(typeof [])
    }
  })

  test('single - multiple bbox', () => {
    const iterable = slippyGrid.single([[-20.0, -20.0, 20, 20], [-15.0, -10.0, 10, 10]], 1, 5)
    let count = 0
    while (true) {
      const { done } = iterable.next()
      if (done) { break }
      count++
    }
    expect(count).toBe(32)
  })

  test('bulk - multiple bbox', () => {
    const iterable = slippyGrid.bulk([[-20.0, -20.0, 20, 20], [-15.0, -10.0, 10, 10]], 1, 5, 500)
    const { value } = iterable.next()
    expect(value.length).toBe(32)
  })

  test('count', () => expect(slippyGrid.count(BBOX, 3, 21)).toBe(37773648480704))
  test('levels', () => expect(slippyGrid.levels(BBOX, 3, 21).length).toBe(19))
})
