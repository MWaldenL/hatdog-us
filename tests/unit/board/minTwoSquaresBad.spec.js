import BoardHelper from '@/helpers/BoardHelper'
import Player from '@/model/dataobjects/Player'
import Square from '@/model/dataobjects/Square'

describe('BoardHelper.minTwoSquares bad', () => {
  it('same col', () => {
    // arrange
    const players = [
      new Player({ square: new Square(0, 0) })
    ]
    const expected = false

    // act
    const result = BoardHelper.isMinTwoSquaresApart(players, 2, 0)

    // assert
    expect(result).toEqual(expected)
  }),
  it('same row', () => {
    // arrange
    const players = [
      new Player({ square: new Square(0, 0) })
    ]
    const expected = false

    // actc
    const result = BoardHelper.isMinTwoSquaresApart(players, 0, 1)

    // asserts
    expect(result).toEqual(expected)
  }),
  it('diag NE', () => {
    // arrange
    const players = [
      new Player({ square: new Square(1, 1) })
    ]
    const expected = false

    // actc
    const result = BoardHelper.isMinTwoSquaresApart(players, 0, 2)

    // asserts
    expect(result).toEqual(expected)
  }),
  it('diag NW', () => {
    // arrange
    const players = [
      new Player({ square: new Square(1, 1) })
    ]
    const expected = false

    // actc
    const result = BoardHelper.isMinTwoSquaresApart(players, 0, 0)

    // asserts
    expect(result).toEqual(expected)
  }),
  it('diag SE', () => {
    // arrange
    const players = [
      new Player({ square: new Square(1, 1) })
    ]
    const expected = false

    // actc
    const result = BoardHelper.isMinTwoSquaresApart(players, 2, 2)

    // assert
    expect(result).toEqual(expected)
  }),
  it('diag SW', () => {
    // arrange
    const players = [
      new Player({ square: new Square(1, 1) })
    ]
    const expected = false

    // actc
    const result = BoardHelper.isMinTwoSquaresApart(players, 2, 0)

    // asserts
    expect(result).toEqual(expected)
  })
})
