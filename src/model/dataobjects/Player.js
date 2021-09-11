export default class Player {
  constructor({id, gameID, name, square, online, host, playerNum}) {
    this.id = id
    this.gameID = gameID
    this.name = name
    this.square = square 
    this.online = online 
    this.host = host
    this.infected = false
    this.contactInfo = {
      inContact: false,   //if player is currently in contact with other player
      withAlly: false,    //if the other player is an ally
      isReceiver: false,  //if the player (self) is a receiver
      otherName: ''       //name of the other player
    }
    this.playerNum = playerNum
    this.dir = 'down'
    // TODO: save initial infected state
  }
}