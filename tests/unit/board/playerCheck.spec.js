import BoardHelper from '@/helpers/BoardHelper'
import Player from '@/model/dataobjects/Player'
import Square from '@/model/dataobjects/Square'

describe('BoardHelper.squareHasMaxOnePlayer()', () => {
  it('one player', () => {
    // arrange
    const square = new Square(0, 0)
    square.addPlayer(new Player({}))
    const board = [[square]]
    const expected = true

    // act 
    const result = BoardHelper._squareHasMaxOnePlayer(board, 0, 0)

    // assert
    expect(result).toEqual(expected)
  }),
  it('> 1 player', () => {
    // arrange
    const square = new Square(0, 0)
    square.addPlayer(new Player({}))
    square.addPlayer(new Player({}))
    square.addPlayer(new Player({}))
    const board = [[square]]
    const expected = false

    // act 
    const result = BoardHelper._squareHasMaxOnePlayer(board, 0, 0)

    // assert
    expect(result).toEqual(expected)
  })
})

describe('BoardHelper.getPlayerCountInSquare()', () => {
  it('player count = 1', () => {
    // arrange
    const square = new Square(0, 0)
    square.addPlayer(new Player({}))
    const board = [[square]]
    const expected = 1

    // act 
    const result = BoardHelper.getPlayerCountInSquare(board, 0, 0)

    // assert
    expect(result).toEqual(expected)
  }),
  it('player count = 0', () => {
    // arrange
    const square = new Square(0, 0)
    const board = [[square]]
    const expected = 0

    // act 
    const result = BoardHelper.getPlayerCountInSquare(board, 0, 0)

    // assert
    expect(result).toEqual(expected)
  })
})

describe('BoardHelper.getOtherPlayerInSquare()', () => {
  it('two players in square', () => {
    // arrange
    const sq = new Square(0, 0); 
    sq.addPlayer(new Player({id: 'ME'}))
    sq.addPlayer(new Player({id: 'YOU'}))
    const selfId = 'ME'
    const board = [[sq]]
    const row = 0
    const col = 0
    const expected = new Player({id: 'YOU'})

    // act
    const result = BoardHelper.getOtherPlayerInSquare(selfId, board, row, col)

    // assert
    expect(result).toEqual(expected)
  }),
  it('one player in square', () => {
    // arrange
    const sq = new Square(0, 0); 
    sq.addPlayer(new Player({id: 'ME'}))  
    const selfId = 'ME'
    const board = [[sq]]
    const row = 0
    const col = 0
    const expected = undefined

    // act
    const result = BoardHelper.getOtherPlayerInSquare(selfId, board, row, col)

    // assert
    expect(result).toEqual(expected)
  })
})
