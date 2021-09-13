import BoardHelper from '@/helpers/BoardHelper'

describe('BoardHelper.isSquareWall()', () => {
  it('checks if a square is a wall', () => {
    const result = BoardHelper.isSquareWall(1, 0, 0)
    const expected = true
    expect(result).toEqual(expected)
  }),
  it('checks if a square is not a wall', () => {
    const result = BoardHelper.isSquareWall(1, 1, 1)
    const expected = false
    expect(result).toEqual(expected)
  })
})
