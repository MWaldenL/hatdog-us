import Square from '@/model/dataobjects/Square'
import GameHelper from './GameHelper'
import Helper from './helper'

export default class BoardHelper {
  static initializeBoard(mapConfig) {
    let res = []
    for (let i=0; i < 15; i++) {
      res.push([])
    }
    for (let i=0; i < 15; i++) {
      for (let j=0; j < 15; j++) {
        res[i][j] = new Square(i, j, this.isSquareWall(mapConfig, i, j) === 1)
      }
    }

    return res
  }

  static isSquareWall(mapConfig, row, col) {
    switch (mapConfig) {
      case 1: return config1[row][col]
      case 2: return config2[row][col]
      case 3: return config3[row][col]
      case 4: return config4[row][col]
      case 5: return config5[row][col]
      default: return false
    }
  }

  static move(player, direction, board, row, col) {
    const up = ['ArrowUp', 'W', 'w'].includes(direction)
    const down = ['ArrowDown', 'S', 's'].includes(direction)
    const left = ['ArrowLeft', 'A', 'a'].includes(direction)
    const right = ['ArrowRight', 'D', 'd'].includes(direction)
    let res = {row, col}, toMove

    if (up || down) {
      toMove = up ? Math.max(row-1, 0) : Math.min(row+1, board.length-1)
      if (this._squareHasMaxOnePlayer(board, toMove, col)) {
        res = {row: toMove, col} // save new square object to be received
      }
    } else if (left || right) {
      toMove = left ? Math.max(col-1, 0) : Math.min(col+1, board.length-1)
      if (this._squareHasMaxOnePlayer(board, row, toMove)) {
        res = {row, col: toMove}
      }
    } 
    return res
  }

  static randomMove(player, board, row, col) {
    let randomIndex = Helper.getRandomInt(0, GameHelper.moveKeys.length)
    let direction = GameHelper.moveKeys[randomIndex]
    
    const up = ['ArrowUp', 'W', 'w'].includes(direction)
    const down = ['ArrowDown', 'S', 's'].includes(direction)
    const left = ['ArrowLeft', 'A', 'a'].includes(direction)
    const right = ['ArrowRight', 'D', 'd'].includes(direction)
    let res = {row, col}, toMove

    if (up || down) {
      toMove = up ? Math.max(row-1, 0) : Math.min(row+1, board.length-1)
      if (this._squareHasMaxOnePlayer(board, toMove, col)) {
        res = {row: toMove, col} // save new square object to be received
      }
    } else if (left || right) {
      toMove = left ? Math.max(col-1, 0) : Math.min(col+1, board.length-1)
      if (this._squareHasMaxOnePlayer(board, row, toMove)) {
        res = {row, col: toMove}
      }
    } 
    return res
  }

  static isSquareOccupied(players, row, col) {
    for (let player of players) {
      let { r, c } = player.square
      if (row === r && col == c) {
        return true
      }
    }
    return false
  }

  static isMinTwoSquaresApart(players, row, col) {
    for (let player of players) {
      let r = player.row
      let c = player.col
      
      // check vertical
      if (row === r && this._absDiff(c, col) <= 2)
        return false

      // check horizontal
      if (col === c && this._absDiff(r, row) <= 2)
        return false

      // check diagonal  
      if (
          col === c + 1 && row === r + 1 ||
          col === c + 1 && row === r - 1 ||
          col === c - 1 && row === r + 1 ||
          col === c - 1 && row === r - 1
      )  
        return false
    }
    return true 
  }

  static getOtherPlayerInSquare(selfId, board, row, col) {
    let playersSet = board[row][col].currentPlayers
    let playerArr = [...playersSet].filter(id => id !== selfId)
    return playerArr[0]
  }

  static getPlayerCountInSquare(board, row, col) {
    return board[row][col].getPlayerCount()
  }
  
  static _squareHasMaxOnePlayer(board, row, col) {
    return board[row][col].getPlayerCount() <= 1
  }

  static _absDiff(num1, num2) {
    return Math.abs(num1 - num2)
  }
}

const config1 = [
  [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1],
]

const config2 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const config3 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const config4 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const config5 = [
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
]