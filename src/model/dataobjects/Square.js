export default class Square {
  constructor(row, col, isWall, currentPlayers) {
    this.row = row
    this.col = col
    this.isWall = isWall
    this.currentPlayers = currentPlayers ? currentPlayers : new Set()
  }

  getPlayerCount() {
    return this.currentPlayers.size
  }

  addPlayer(playerId) {
    this.currentPlayers.add(playerId)
  }

  removePlayer(playerId) {
    this.currentPlayers.delete(playerId)
  }

  setAsWall() {
    this.isWall = true
  }
}