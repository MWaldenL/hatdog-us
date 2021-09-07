export default class Square {
  constructor(row, col, currentPlayers) {
    this.row = row
    this.col = col
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
}