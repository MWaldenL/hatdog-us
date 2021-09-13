import BoardHelper from '@/helpers/BoardHelper'
import Player from '@/model/dataobjects/Player'
import Square from '@/model/dataobjects/Square'

describe('BoardHelper.minTwoSquares good', () => {
  it('same col', () => {
    // arrange
    const players = [
      new Player({ square: new Square(0, 0) })
    ]
    const expected = true

    // act
    const result = BoardHelper.isMinTwoSquaresApart(players, 3, 0)

    // assert
    expect(result).toEqual(expected)
  }),
  it('same row', () => {
    // arrange
    const players = [
      new Player({ square: new Square(0, 0) })
    ]
    const expected = true

    // actc
    const result = BoardHelper.isMinTwoSquaresApart(players, 0, 3)

    // asserts
    expect(result).toEqual(expected)
  }),
  it('far apart', () => {
    // arrange
    const players = [
      new Player({ square: new Square(0, 0) })
    ]
    const expected = true

    // actc
    const result = BoardHelper.isMinTwoSquaresApart(players, 5, 8)

    // asserts
    expect(result).toEqual(expected)
  })
})
