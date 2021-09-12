<template>
  <Entry v-if="!entered" @enterGame="enterGame" />
  <div v-else>
    <div>
      <h1>Game ID: {{ gameID }}</h1>
    </div>
    <div id="home">
      <!-- Player list -->
      <div id="playerList" style="margin-end: 16px">
        <h1>Team Count</h1>
        <p>Clean: {{cleanCount}}</p>
        <p>Infected: {{infectedCount}}</p>
        <h1>Players ({{ players.length }}):</h1> 
        <div>
          <div v-for="player in players" :key="player.id">
            <PlayerItem v-if="player.online" 
              :name="player.name"
              :num="player.playerNum"
              :you="player.id === playerID" />
            <!-- <li v-if="player.online">{{ player.name }}</li> -->
          </div>
        </div>
      </div>
      <Board 
        :gameID="gameID"
        :playerID="playerID"
        :startRow="row" 
        :startCol="col"
        :canMove="canMove"
        @playerMoved="waitTwoSeconds"
        ref="boardRef"/>
      <!-- Timer -->
      <div style="margin-start: 16px">
        <div id="timer">
          <h1 v-if="dialogTimer == 0">Move in: {{ timer }}</h1>
          <h1 v-else>Move in: {{ dialogTimer }}</h1>
        </div>
        <div v-if="playerIsHost">
          <div>You are the host.</div>
          <div><button @click="startGame" :disabled="!minPlayersReached">Start Game</button></div>
        </div>
        <div v-if="this.gameStarted">
          <h3>Game has started.</h3>
          <div v-if="player && player.infected">You are infected.</div>
          <div v-else>You are clean.</div>
          <div v-if="forceMoveTimer != 0">You will be forcefully moved in {{forceMoveTimer}}</div>
        </div>
      </div>
      <Dialog :isOpen="dialogOpen" :timer="dialogTimer" :message="dialogMessage"/>
      <Modal :isOpen="modalOpen" :header="modalHeader" :body="modalBody"/>
    </div>
  </div>
</template>

<script>
import { db, playersRef, gameRef } from "@/firebase"
import Entry from './Entry'
import PlayerItem from './PlayerItem' 
import Player from '@/model/dataobjects/Player'
import Square from '@/model/dataobjects/Square'
import PlayerRepository from '@/model/repository/playerRepository'
import GameRepository from '@/model/repository/gameRepository'
import GameHelper from '@/helpers/GameHelper'
import Helper from '@/helpers/helper'
import Board from './Board'
import _ from 'underscore'
import Dialog from './Dialog'
import Modal from './Modal'

export default {
  data() {
    return {
      gameID: '',
      playerID: '',
      player: null,
      allPlayers: [],
      allGames: [],
      row: -1,
      col: -1,
      canMove: true,
      timer: 0,
      dialogOpen: false,
      dialogMessage: '',
      dialogTimer: 0,
      forceMoveTimer: 0,
      hasMovedAfterContact: false,
      cleanCount: 0,
      infectedCount: 0,
      connectionListener: null,
      mapConfig: 0,
      modalHeader: '',
      modalBody: '',
      modalOpen: false
    }
  },
  firebase: {
    allPlayers: playersRef,
    allGames: gameRef
  },
  components: {
    Entry,
    Board,
    Dialog, 
    Modal,
    PlayerItem
  },
  computed: {
    entered() {
      return this.playerID.length > 0
    },

    players() {
      return this.allPlayers.filter(player => player.gameID === this.gameID)
    },

    game() {
      return this.allGames.filter(game => game['.key'] === this.gameID)[0]
    },

    hostExists() {
      for (let player of this.players)
        if (player.host)
          return true
      return false
    },

    minPlayersReached() {
      return this.players.length >= 4
    },

    lobbyIsFull() {
      return this.players.length === 10
    },

    onePlayerLeft() {
      return this.players.length === 1
    },

    gameStarted() {
      return this.game && this.game.gameStarted
    },

    playerIsHost() {
      return this.player && this.game && this.player.host && !this.game.gameStarted
    },

    playerIsHostThroughOut() {
      return this.player && this.player.host
    }
  },
  watch: {
    onePlayerLeft(newValue) {
      if (newValue === true)
        db.ref(`game/${this.gameID}`).onDisconnect().remove()
      else
        db.ref(`game/${this.gameID}`).onDisconnect().cancel()
    },

    players(newValue, oldValue) {
      if (!this.playerIsHostThroughOut) { return }
      let newOtherPlayers = [...newValue].filter(p => p.id !== this.playerID)
      let oldOtherPlayers = [...oldValue].filter(p => p.id !== this.playerID)

      if (newOtherPlayers.length !== 0) {
        if (oldOtherPlayers.length !== 0) {
          db.ref(`players/${oldOtherPlayers[0].id}`).onDisconnect().cancel()
        }
        db.ref(`players/${newOtherPlayers[0].id}`).onDisconnect().update({host: true})
      }
      else {
        db.ref(`players/${oldOtherPlayers[0].id}`).onDisconnect().cancel()
      }
    },

    gameStarted(newValue) {
      if (newValue === true)
        this.setConnectionListener()
    }
  },
  methods: {
    async enterGame(payload) {
      const { roomCode, isNewRoom, name } = payload

      this.playerID = Date.now().toString()
      this.gameID = roomCode
    
      if (isNewRoom) {
        this.mapConfig = Helper.getRandomInt(1, 5)
      } else {
        this.mapConfig = this.game.mapConfig
      }

      this.setStartingPos(this.mapConfig)

      // If new room, create a new game 
      if (isNewRoom) {
        await GameRepository.initGame(this.gameID, this.mapConfig)
      }

      // Add the player to the game object
      await PlayerRepository.addPlayer(new Player({
        id: this.playerID,
        gameID: this.gameID,
        name,
        square: new Square(this.row, this.col),
        online: true,
        host: isNewRoom, // player is host if he created a new room
        playerNum: this.getMissingPlayerNum()
      }))
      PlayerRepository.observeOnlineStatus(this.playerID)

      // Set the current player
      await this.setCurrentPlayer()

      await this.setTeamCountListener()
    },

    getMissingPlayerNum() {
      let missingNum = 1
      let playerNums = this.players.map(p => p.playerNum).sort()
      console.log(`player nums: ${playerNums}`)
      for (let pNum of playerNums) {
        console.log(`checking: ${pNum} vs ${missingNum}`)
        if (missingNum < pNum)
          return missingNum
        missingNum++
      }
      console.log( `missing num: ${missingNum}`)
      return missingNum
    },

    setCurrentPlayer() {
      db.ref(`players/${this.playerID}`).on("value", (snapshot) => {
        this.player = snapshot.val()

        // Check if player is currently in contact with another player
        if (this.player.contactInfo.inContact) {
          this.showDialog()
          PlayerRepository.updatePlayerContactInfo(this.playerID, false, false, false, '')
        }

        if (this.gameStarted)
          this.setConnectionListener()
      })
    },

    setConnectionListener() {
      if (this.connectionListener != null) 
        db.ref('.info/connected').off("value", this.connectionListener)
          
      this.connectionListener = db.ref('.info/connected').on("value", snap => {
        if (snap.val()) 
          GameRepository.updateTeamCountOnDisconnect(this.gameID, this.player.infected)
      })
    },

    setTeamCountListener() {
      db.ref(`game/${this.gameID}`).on("value", (snapshot) => {
        this.cleanCount = snapshot.val().cleanCount
        this.infectedCount = snapshot.val().infectedCount
        let gameInProgress = snapshot.val().gameStarted
        let aTeamHasWon = (this.cleanCount === 0 || this.infectedCount === 0)

        if (gameInProgress && aTeamHasWon) 
          this.endGame()
      })
    },

    startGame() {
      console.log(`starting game ${this.gameID}`)
      
      // randomly select players to set as infected
      let sampleSize = 0
      if (this.players.length >= 4 && this.players.length <= 6)
        sampleSize = 2
      else if (this.players.length >= 7 && this.players.length <= 10)
        sampleSize = 3
      let randomPlayers = _.sample(this.players, sampleSize)
      for (let p of randomPlayers) {
        PlayerRepository.updatePlayer(p.id, "infected", true)
        PlayerRepository.updatePlayer(p.id, "initiallyInfected", true)
      }

      this.canMove = true
      GameRepository.startGame(this.gameID, this.players.length - sampleSize, sampleSize, this.mapConfig)
    },

    setStartingPos(mapConfig) {
      const square = GameHelper.getStartingSquare(this.players, mapConfig)
      this.row = square.row
      this.col = square.col
    },

    waitTwoSeconds() {
      if (!this.game.gameStarted) { return }
      this.hasMovedAfterContact = true //used in forced move
      this.timer = 2
      this.canMove = false
      let time = setInterval(() => {
        this.timer--
        if (this.timer === 0) {
          clearInterval(time)
          this.canMove = true
        }
      }, 1000)
    },

    showDialog() {
      if (!this.game.gameStarted) { return }
      this.dialogMessage = GameHelper.generateDialogMessage(this.player)
      this.dialogOpen = true
      this.canMove = false
      this.dialogTimer = 5
      let forceTime = this.player.contactInfo.withAlly ? 2 : 3
      let time = setInterval(() => {
        this.dialogTimer--
        if (this.dialogTimer === 0) {
          clearInterval(time)
          this.dialogOpen = false
          this.waitForcedMove(forceTime)
        }
        if (this.modalOpen) {
          clearInterval(time)
          this.dialogOpen
        }
      }, 1000)
    },

    endGame() {
      this.canMove = false
      let teamInfectedWon = (this.infectedCount != 0)
      let message = GameHelper.generateEndGameMessage(teamInfectedWon, this.player)
      this.modalHeader = message.header
      this.modalBody = message.body
      let timer = 2
      let time = setInterval(() => {
        timer--
        if (timer === 0) {
          clearInterval(time)
          this.dialogOpen = false
          this.modalOpen = true
        }
      }, 1000)
    },

    waitForcedMove(n) {
      this.hasMovedAfterContact = false
      this.canMove = true
      this.forceMoveTimer = n
      
      let time = setInterval(() => {
        this.forceMoveTimer--
        if (this.forceMoveTimer === 0) {
          if (!this.hasMovedAfterContact) {
            this.$refs.boardRef.randomMove();
          }
          clearInterval(time)
        }
        if (this.hasMovedAfterContact) {
          this.forceMoveTimer = 0
          clearInterval(time)
        }
      }, 1000)
    }

  }
}
</script>
<style>
#home {
  display: flex;
  justify-content: center;
  align-content: center
}
</style>
