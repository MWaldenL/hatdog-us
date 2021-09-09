import BoardHelper from "./BoardHelper"
import Helper from "./helper"
import Square from '@/model/dataobjects/Square'
import { playersRef } from '@/firebase'
import PlayerRepository from "../model/repository/playerRepository"
import GameRepository from "../model/repository/gameRepository"

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
      let self = snapshot.val()[selfId]
      let other = snapshot.val()[otherPlayerId]
      if (self.infected === other.infected) {        
        PlayerRepository.updatePlayerContactInfo(selfId, true, true, false, other.name)
        PlayerRepository.updatePlayerContactInfo(otherPlayerId, true, true, false, self.name)
      }
      else {
        let tossCoin = Math.floor(Math.random() * 2)
        if (tossCoin === 0) {
          let isInfected = !self.infected
          PlayerRepository.updatePlayer(selfId, "infected", isInfected) 
          PlayerRepository.updatePlayerContactInfo(selfId, true, false, true, other.name)
          PlayerRepository.updatePlayerContactInfo(otherPlayerId, true, false, false, self.name)

          if (isInfected)
            GameRepository.incrementInfected()
          else
            GameRepository.incrementClean()
        } 
        else {
          let isInfected = !other.infected
          PlayerRepository.updatePlayer(otherPlayerId, "infected", isInfected)
          PlayerRepository.updatePlayerContactInfo(otherPlayerId, true, false, true, self.name)
          PlayerRepository.updatePlayerContactInfo(selfId, true, false, false, other.name)
          if (isInfected)
            GameRepository.incrementInfected()
          else
            GameRepository.incrementClean()
        }
      }
    })
  }

  static generateDialogMessage(player) {
    let res
    let status = player.infected ? 'infected' : 'cleaned'
    
    if (player.contactInfo.withAlly) {
      res = `You are on the same team with ${player.contactInfo.otherName}.`
    }
    else {
      if (player.contactInfo.isReceiver) {
        res = `You have been ${status} by ${player.contactInfo.otherName}`
      }
      else {
        res = `You have ${status} ${player.contactInfo.otherName}`
      }
    }
    return res
  }
}