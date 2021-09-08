export default class Player {
  constructor({id, gameID, name, square, online, host}) {
    this.id = id
    this.gameID = gameID
    this.name = name
    this.square = square 
    this.online = online 
    this.host = host,
    this.infected = false
  }
}