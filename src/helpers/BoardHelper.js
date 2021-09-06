import Helper from '@/helpers/helper'
import Square from '@/model/dataobjects/Square'

export default class BoardHelper {
  static initializeBoard() {
    return Array.from(Array(15), () => Array(15).fill(new Square()))
  }

  static move(direction, board, row, col) {
    const up = ['ArrowUp', 'W', 'w'].includes(direction)
    const down = ['ArrowDown', 'S', 's'].includes(direction)
    const left = ['ArrowLeft', 'A', 'a'].includes(direction)
    const right = ['ArrowRight', 'D', 'd'].includes(direction)
    let res = new Square(row, col), toMove

    if (up) {
      toMove = Math.max(row-1, 0)
      if (board[toMove][col] === '') {
        res = new Square(toMove, col)
      }
    } else if (left) {
      toMove = Math.max(col-1, 0)
      if (board[row][toMove] === '') {
        res = new Square(row, toMove)
      }
    } else if (down) {
      toMove = Math.min(row+1, board.length-1)
      if (board[toMove][col] === '') {
        res = new Square(toMove, col)
      }
    } else if (right) {
      toMove = Math.min(col+1, board.length-1)
      if (board[row][toMove] === '') {
        res = new Square(row, toMove)
      }
    }
    return res
  }

  static getBoardWithPlayers(players, thisRow, thisCol) {
    let newBoard = Array.from(Array(15), () => Array(15).fill(''))
    newBoard[thisRow][thisCol] = 'o' // this player
    for (let player of players) { // other players
      let {row, col} = player.square
      newBoard[row][col] = 'o'
    }
    return newBoard
  }

  static getStartingSquare(players) {
    let row = 0, col = 0, badSquare
    do {
      row = Helper.getRandomInt(0, 15)
      col = Helper.getRandomInt(0, 15)
      badSquare = 
        this._isOccupied(players, row, col) && 
        this._isMinTwoSquaresApart(players, row, col)
    } while (badSquare)
    return new Square(row, col)
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
}