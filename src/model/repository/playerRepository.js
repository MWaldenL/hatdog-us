import { db } from '@/firebase'

export default class PlayerRepository {
  static addPlayer(p) {
    const { id, gameID, name, square, online } = p
    db.ref(`players/${id}`).set({
      gameID, 
      name,
      square,
      online
    })
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
        statusRef.onDisconnect().set(false)
        statusRef.set(true)
      }
    })
  }

  static updatePlayer(id, field, value) {
    db.ref(`players/${id}/${field}`).set(value)
  }
}