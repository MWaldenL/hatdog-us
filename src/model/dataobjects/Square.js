export default class Square {
  constructor(row, col, currentPlayers) {
    this.row = row
    this.col = col
    this.currentPlayers = currentPlayers ? currentPlayers : new Set()

    if (row === 4 && col == 4)
      this.isWall = true
    else
      this.isWall = false

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
}