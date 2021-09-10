import { db } from '@/firebase'

export default class GameRepository {
  static initGame(id) {
    db.ref(`game/${id}`).set({ gameStarted: false })
  }

  static startGame(id) {
    db.ref(`game/${id}`).set({ gameStarted: true })
  }
}