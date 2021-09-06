import BoardHelper from "./BoardHelper"

export default class GameHelper {
  static getBoardWithPlayers(selfId, players, selfRow, selfCol) {
    let newBoard = BoardHelper.initializeBoard()
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
        BoardHelper._isOccupied(players, row, col) && 
        BoardHelper._isMinTwoSquaresApart(players, row, col)
    } while (badSquare)
    return new Square(row, col, [self.id])
  }
}