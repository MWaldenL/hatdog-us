import Helper from '@/helpers/helper'
import Square from '@/model/dataobjects/Square'

export default class BoardHelper {
  static initializeBoard() {
    let res = []
    for (let i=0; i < 16; i++) res.push([])
    
    for (let i=0; i < 16; i++) {
      for (let j=0; j < 16; j++) {
        res[i][j] = new Square(i, j, [])
      }
    }
    return res
  }

  static move(player, direction, board, row, col) {
    const up = ['ArrowUp', 'W', 'w'].includes(direction)
    const down = ['ArrowDown', 'S', 's'].includes(direction)
    const left = ['ArrowLeft', 'A', 'a'].includes(direction)
    const right = ['ArrowRight', 'D', 'd'].includes(direction)
    let res = new Square(row, col), toMove

    if (up || down) {
      toMove = up ? Math.max(row-1, 0) : Math.min(row+1, board.length-1)
      if (this._squareHasMaxOnePlayer(board, toMove, col)) {
        const newPlayers = [...board[toMove][col].currentPlayers, player]
        console.log(board[toMove][col].currentPlayers)
        console.log(player)
        res = new Square(toMove, col, newPlayers) // save new square object to be received
      }
    } else if (left || right) {
      toMove = left ? Math.max(col-1, 0) : Math.min(col+1, board.length-1)
      if (this._squareHasMaxOnePlayer(board, row, toMove)) {
        console.log(board[row][toMove].currentPlayers)
        console.log(player)
        const newPlayers = [...board[row][toMove].currentPlayers, player]
        res = new Square(row, toMove, newPlayers)
      }
    } 
    return res
  }

  static getBoardWithPlayers(selfId, players, selfRow, selfCol) {
    let newBoard = this.initializeBoard()
    newBoard[selfRow][selfCol].addPlayer(selfId) // set self first
    for (let player of players) { // set other players
      let {row, col} = player.square
      newBoard[row][col].addPlayer(player['.key'])
    }
    return newBoard
  }

  static getStartingSquare(self, players) {
    let row = 0, col = 0, badSquare
    do {
      row = Helper.getRandomInt(0, 15)
      col = Helper.getRandomInt(0, 15)
      badSquare = 
        this._isOccupied(players, row, col) && 
        this._isMinTwoSquaresApart(players, row, col)
    } while (badSquare)
    return new Square(row, col, [self.id])
  }

  static _isOccupied(players, row, col) {
    for (let player of players) {
      let { r, c } = player.square
      if (row === r && col == c) {
        return true
      }
    }
    return false
  }

  static _isMinTwoSquaresApart(players, row, col) {
    // TODO: Byron
    console.log(players, row, col)
    return true 
  }
  
  static _squareHasMaxOnePlayer(board, row, col) {
    return board[row][col].getPlayerCount() <= 1
  }
}