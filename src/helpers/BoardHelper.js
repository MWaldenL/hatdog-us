import Square from '@/model/dataobjects/Square'

export default class BoardHelper {
  static initializeBoard() {
    let res = []
    for (let i=0; i < 16; i++) {
      res.push([])
    }
    for (let i=0; i < 16; i++) {
      for (let j=0; j < 16; j++) {
        res[i][j] = new Square(i, j)
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
        res = new Square(toMove, col) // save new square object to be received
      }
    } else if (left || right) {
      toMove = left ? Math.max(col-1, 0) : Math.min(col+1, board.length-1)
      if (this._squareHasMaxOnePlayer(board, row, toMove)) {
        res = new Square(row, toMove)
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
  
  static _squareHasMaxOnePlayer(board, row, col) {
    return board[row][col].getPlayerCount() <= 1
  }

  static _absDiff(num1, num2) {
    return Math.abs(num1 - num2)
  }
}