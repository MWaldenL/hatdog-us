import BoardHelper from '@/helpers/BoardHelper'
import Player from '@/model/dataobjects/Player'
import Square from '@/model/dataobjects/Square'

describe('BoardHelper.isSquareOccupied() good cases', () => {
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
  }),
  it('checks if a square is not occupied by a player', () => {
    // arrange
    const players = [
      new Player({ square: new Square(0, 0) })
    ]
    const expected = false

    // act
    const result = BoardHelper.isSquareOccupied(players, 1, 1)

    // asserts
    expect(result).toEqual(expected)
  })
})
