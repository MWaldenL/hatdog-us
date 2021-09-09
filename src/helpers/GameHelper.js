import BoardHelper from "./BoardHelper"
import Helper from "./helper"
import Square from '@/model/dataobjects/Square'
import { playersRef } from '@/firebase'
import PlayerRepository from "../model/repository/playerRepository"

export default class GameHelper {

  static keys = [
    'ArrowUp', 'W', 'w',
    'ArrowDown', 'S', 's',
    'ArrowLeft', 'A', 'a', 
    'ArrowRight', 'D', 'd'
  ]

  static getBoardWithPlayers(selfId, players, selfRow, selfCol) {
    let newBoard = BoardHelper.initializeBoard()
    newBoard[selfRow][selfCol].addPlayer(selfId) // set self first
    for (let player of players) { // set other players
      let {row, col} = player.square
      newBoard[row][col].addPlayer(player['.key'])
    }
    return newBoard
  }

  static getStartingSquare(players) {
    let row = 0, col = 0, badSquare
    do {
      row = Helper.getRandomInt(0, 15)
      col = Helper.getRandomInt(0, 15)
      badSquare = 
        BoardHelper.isSquareOccupied(players, row, col) && 
        !BoardHelper.isMinTwoSquaresApart(players, row, col)
    } while (badSquare)
    return new Square(row, col)
  }

  static simulateContactInteraction(selfId, otherPlayerId) {
  
    playersRef.once("value").then((snapshot) => {            
      let selfInfected = snapshot.val()[selfId].infected
      let otherPlayerInfected = snapshot.val()[otherPlayerId].infected
      if (selfInfected === otherPlayerInfected) {        
        PlayerRepository.updatePlayer(selfId, "contactWithAlly", true)                
        PlayerRepository.updatePlayer(otherPlayerId, "contactWithAlly", true)
      }
      else {
        PlayerRepository.updatePlayer(selfId, "contactWithAlly", false)                
        PlayerRepository.updatePlayer(otherPlayerId, "contactWithAlly", false)

        let tossCoin = Math.floor(Math.random() * 2)
        if (tossCoin === 0) {
          selfInfected = !selfInfected
          PlayerRepository.updatePlayer(selfId, "infected", selfInfected) 
        } 
        else {
          otherPlayerInfected = !otherPlayerInfected
          PlayerRepository.updatePlayer(otherPlayerId, "infected", otherPlayerInfected) 
        }
      }
      PlayerRepository.updatePlayer(selfId, "inContact", true)
      PlayerRepository.updatePlayer(otherPlayerId, "inContact", true)
    })
  }
}