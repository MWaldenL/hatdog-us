import BoardHelper from '@/helpers/BoardHelper'
import Square from '@/model/dataobjects/Square'

const board = BoardHelper.initializeBoard(1)

describe('BoardHelper.move()', () => {
  it('up', () => {
    // arrange
    const row = 4
    const col = 1
    const mapConfig = 1
    const expected = new Square(3, 1)

    // act 
    const result = BoardHelper.move('W', board, row, col, mapConfig)

    // assert
    expect(result).toEqual(expected)
  }),
  it('down', () => {
    // arrange
    const row = 4
    const col = 1
    const mapConfig = 1
    const expected = new Square(5, 1)

    // act 
    const result = BoardHelper.move('S', board, row, col, mapConfig)

    // assert
    expect(result).toEqual(expected)
  }),
  it('left', () => {
    // arrange
    const row = 4
    const col = 1
    const mapConfig = 1
    const expected = new Square(4, 0)

    // act 
    const result = BoardHelper.move('A', board, row, col, mapConfig)

    // assert
    expect(result).toEqual(expected)
  }),
  it('right', () => {
    // arrange
    const row = 4
    const col = 1 
    const mapConfig = 1
    const expected = new Square(4, 2)

    // act 
    const result = BoardHelper.move('D', board, row, col, mapConfig)

    // assert
    expect(result).toEqual(expected)
  })
})
