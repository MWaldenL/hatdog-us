import { db } from '@/firebase'

export default class PlayerRepository {
  static initGame() {
    db.ref(`game`).on("value", snapshot => {
      if (!snapshot.exists()) {
        console.log("creating game")
        const gameStarted = false
        db.ref(`game`).set({
          gameStarted
        })
      } else {
        console.log("game already exists")
      }
    })
  }

  static startGame() {
    const gameStarted = true
    db.ref(`game`).set({gameStarted})
  }
}