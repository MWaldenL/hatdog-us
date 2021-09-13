import BoardHelper from '@/helpers/BoardHelper'
import Player from '@/model/dataobjects/Player'
import Square from '@/model/dataobjects/Square'

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

describe('BoardHelper.isSquareOccupied()', () => {
  it('checks if a square is occupied by a player', () => {
    // arrange
    const players = [
      new Player({ square: new Square(0, 0) })
    ]
    const expected = true

    // act
    const result = BoardHelper.isSquareOccupied(players, 0, 0)

    // assert
    expect(result).toEqual(expected)
  })
})