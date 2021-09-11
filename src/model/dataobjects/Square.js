export default class Square {
  constructor(row, col, isWall) {
    this.row = row
    this.col = col
    this.isWall = isWall ? isWall : false
    this.currentPlayers = new Set()
  }

  getPlayerCount() {
    return this.currentPlayers.size
  }

  addPlayer(player) {
    this.currentPlayers.add(player)
  }

  removePlayer(player) {
    this.currentPlayers.delete(player)
  }

  setAsWall() {
    this.isWall = true
  }

}