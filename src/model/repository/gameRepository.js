import { db } from '@/firebase'
import firebase from 'firebase'

export default class GameRepository {
  static initGame() {
    const gameStarted = false
    const cleanCount = 0
    const infectedCount = 0
    db.ref(`game`).set({gameStarted, cleanCount, infectedCount})
  }

  static startGame(cleanCount, infectedCount) {
    const gameStarted = true
    db.ref(`game`).set({gameStarted, cleanCount, infectedCount})
  }

  // implicitly decrements infected count
  static incrementClean() {
    db.ref(`game`).child('cleanCount').set(firebase.database.ServerValue.increment(1))
    db.ref(`game`).child('infectedCount').set(firebase.database.ServerValue.increment(-1))
  }

  // implicitly decrements clean count
  static incrementInfected() {
    db.ref(`game`).child('infectedCount').set(firebase.database.ServerValue.increment(1))
    db.ref(`game`).child('cleanCount').set(firebase.database.ServerValue.increment(-1))
  }
}