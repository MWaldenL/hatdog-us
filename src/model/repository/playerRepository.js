import { db } from '@/firebase'

export default class PlayerRepository {
  static addPlayer(p) {
    const { id, gameID, name, square, online, host, infected, contactInfo } = p
    db.ref(`players/${id}`).set({
      id,
      gameID, 
      name,
      square,
      online,
      host,
      infected,
      contactInfo
    })
  }

  static updatePlayer(id, field, value) {
    db.ref(`players/${id}/${field}`).set(value)
  }

  static updatePlayerSquare(id, row, col) {
    db.ref(`players/${id}/square`).set({ row, col })
  }

  static updatePlayerContactInfo(id, inContact, withAlly, isReceiver, otherName) {
    db.ref(`players/${id}/contactInfo`).set({inContact, withAlly, isReceiver, otherName})
  }

  static removePlayer(id) {
    db.ref(`players/${id}`).remove()
  }

  static observeOnlineStatus(id) {
    if (id.length === 0) {
      return 
    }
    const connRef = db.ref('.info/connected')
    const statusRef = db.ref(`players/${id}/online`)
    connRef.on("value", snap => {
      if (snap.val()) {
        db.ref(`players/${id}`).onDisconnect().remove()
        statusRef.set(true)
      }
    })
  }
}