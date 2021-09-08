import BoardHelper from "./BoardHelper"
import Helper from "./helper"
import Square from '@/model/dataobjects/Square'

export default class GameHelper {
  static getBoardWithPlayers(selfId, players, selfRow, selfCol) {
    let newBoard = BoardHelper.initializeBoard()
    if (!players || players.length === 0) { // early abort if players are undefined or empty
      return newBoard
    }
    newBoard[selfRow][selfCol].addPlayer(selfId) // set self first
    for (let player of players) { // set other players
      let {row, col} = player.square
      newBoard[row][col].addPlayer(player['.key'])
    }
    return newBoard
  }

  static getStartingSquare(players) { // no wall checking yet for now
    let row = 0, col = 0, badSquare
    if (!players || players.length === 0) { // no need to check if first player to enter
      row = Helper.getRandomInt(0, 15)
      col = Helper.getRandomInt(0, 15)
    } else { // check only when there are existing players
      do {
        row = Helper.getRandomInt(0, 15)
        col = Helper.getRandomInt(0, 15)
        badSquare = 
          BoardHelper.isSquareOccupied(players, row, col) && 
          !BoardHelper.isMinTwoSquaresApart(players, row, col)
      } while (badSquare)
    }
    return new Square(row, col)
  }
}