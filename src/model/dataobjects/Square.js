export default class Square {
  constructor(row, col, currentPlayers) {
    this.row = row
    this.col = col
    this.currentPlayers = currentPlayers
  }

  getPlayerCount() {
    return this.currentPlayers.length
  }

  addPlayer(playerId) {
    this.currentPlayers.push(playerId)
  }

  removePlayer() {
    this.numPlayers = Math.min(0, this.numPlayers-1)
  }
}