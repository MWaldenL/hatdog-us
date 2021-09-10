import BoardHelper from "./BoardHelper"
import Helper from "./helper"
import Square from '@/model/dataobjects/Square'
import { playersRef } from '@/firebase'
import PlayerRepository from "../model/repository/playerRepository"
import GameRepository from "../model/repository/gameRepository"

export default class GameHelper {

  static moveKeys = [
    'ArrowUp', 'W', 'w',
    'ArrowDown', 'S', 's',
    'ArrowLeft', 'A', 'a', 
    'ArrowRight', 'D', 'd'
  ]

  static getBoardWithPlayers(players, mapConfig) {
    console.log(mapConfig)
    let newBoard = BoardHelper.initializeBoard(mapConfig)
    if (!players || players.length === 0) { // early abort if players are undefined or empty
      return newBoard
    }
    for (let player of players) { // set other players
      let {row, col} = player.square
      newBoard[row][col].addPlayer(player)
    }
    return newBoard
  }

  static getStartingSquare(players, mapConfig) { // no wall checking yet for now
    let row = 0, col = 0, badSquare
    if (!players || players.length === 0) { // no need to check if first player to enter
      row = Helper.getRandomInt(0, 15)
      col = Helper.getRandomInt(0, 15)
    } else { // check only when there are existing players
      do {
        row = Helper.getRandomInt(0, 15)
        col = Helper.getRandomInt(0, 15)
        badSquare = 
          BoardHelper.isSquareOccupied(players, row, col) ||
          !BoardHelper.isMinTwoSquaresApart(players, row, col) ||
          BoardHelper.isSquareWall(mapConfig, row, col)
      } while (badSquare)
    }
    return new Square(row, col)
  }

  static simulateContactInteraction(selfId, otherPlayerId) {
  
    playersRef.once("value").then((snapshot) => {            
      let self = snapshot.val()[selfId]
      let other = snapshot.val()[otherPlayerId]
      let gameId = self.gameID

      if (self.infected === other.infected) {        
        PlayerRepository.updatePlayerContactInfo(selfId, true, true, false, other.name)
        PlayerRepository.updatePlayerContactInfo(otherPlayerId, true, true, false, self.name)
      }
      else {
        let tossCoin = Helper.getRandomInt(0, 2)

        if (tossCoin === 0) {
          let isInfected = !self.infected
          PlayerRepository.updatePlayer(selfId, "infected", isInfected) 
          PlayerRepository.updatePlayerContactInfo(selfId, true, false, true, other.name)
          PlayerRepository.updatePlayerContactInfo(otherPlayerId, true, false, false, self.name)

          if (isInfected)
            GameRepository.incrementInfectedInGame(gameId)
          else
            GameRepository.incrementCleanInGame(gameId)
        } 
        else {
          let isInfected = !other.infected
          PlayerRepository.updatePlayer(otherPlayerId, "infected", isInfected)
          PlayerRepository.updatePlayerContactInfo(otherPlayerId, true, false, true, self.name)
          PlayerRepository.updatePlayerContactInfo(selfId, true, false, false, other.name)
          if (isInfected)
            GameRepository.incrementInfectedInGame(gameId)
          else
            GameRepository.incrementCleanInGame(gameId)
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