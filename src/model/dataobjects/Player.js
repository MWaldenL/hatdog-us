export default class Player {
  constructor({id, gameID, name, square, online}) {
    this.id = id
    this.gameID = gameID
    this.name = name
    this.square = square 
    this.online = online 
  }
}