<template>
  <Entry v-if="!entered" @enterGame="enterGame" />
  <div id="home" v-else>
    <h1>Game ID: {{ gameID }}</h1><br>
    <div id="playerList">
      <h1>Team Count</h1>
      <p>Clean: {{cleanCount}}</p>
      <p>Infected: {{infectedCount}}</p>
      <h1>Players ({{ players.length }}):</h1> 
      <ul v-for="player in players" :key="player.id">
        <li v-if="player.online">{{ player.name }}</li>
      </ul>
    </div>
    <Board 
      :gameID="gameID"
      :playerID="playerID"
      :startRow="row" 
      :startCol="col"
      :canMove="canMove"
      @playerMoved="waitTwoSeconds"
      ref="boardRef"/>
    <div id="timer">
      <h1 v-if="dialogTimer == 0">Move in: {{ timer }}</h1>
      <h1 v-else>Move in: {{ dialogTimer }}</h1>
    </div>
    <div v-if="playerIsHost">
      <div>You are the host.</div>
      <div><button @click="startGame" :disabled="!minPlayersReached">Start Game</button></div>
    </div>
    <Dialog :isOpen="dialogOpen" :timer="dialogTimer" :message="dialogMessage" @contact="showDialog"/>
    <!-- TODO: FIX UI -->
    <div v-if="this.gameStarted">
      Game has started.
      <div v-if="player && player.infected">You are infected.</div>
      <div v-else>You are clean.</div>
      <div v-if="forceMoveTimer != 0">You will be forcefully moved in {{forceMoveTimer}}</div>
    </div>

  </div>
</template>

<script>
import { db, playersRef, gameRef } from "@/firebase"
import Entry from './Entry'
import Player from '@/model/dataobjects/Player'
import Square from '@/model/dataobjects/Square'
import PlayerRepository from '@/model/repository/playerRepository'
import GameRepository from '@/model/repository/gameRepository'
import GameHelper from '@/helpers/GameHelper'
import Board from './Board'
import _ from 'underscore'
import Dialog from './Dialog.vue'

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
      connectionListener: null
    }
  },
  firebase: {
    allPlayers: playersRef,
    allGames: gameRef
  },
  components: {
    Entry,
    Board,
    Dialog
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
      return this.players.length >= 1
    },

    lobbyIsFull() {
      return this.players.length === 10
    },

    gameStarted() {
      return this.game && this.game.gameStarted
    },

    playerIsHost() {
      return this.player && this.game && this.player.host && !this.game.gameStarted
    }
  },

  methods: {
    async enterGame(payload) {
      const { roomCode, isNewRoom, name } = payload
      this.playerID = Date.now().toString()
      this.gameID = roomCode
      this.setStartingPos()

      // If new room, create a new game 
      if (isNewRoom) {
        await GameRepository.initGame(this.gameID)
      }

      // Add the player to the game object
      await PlayerRepository.addPlayer(new Player({
        id: this.playerID,
        gameID: this.gameID,
        name,
        square: new Square(this.row, this.col),
        online: true,
        host: isNewRoom, // player is host if he created a new room
        playerNum: this.players.length + 1
      }))
      PlayerRepository.observeOnlineStatus(this.playerID)

      // Set the current player
      await this.setCurrentPlayer()

      // Set the initial team count
      await this.setTeamCounter()
    },

    setCurrentPlayer() {
      db.ref(`players/${this.playerID}`).on("value", (snapshot) => {
        this.player = snapshot.val()

        // Check if player is currently in contact with another player
        if (this.player.contactInfo.inContact) {
          this.showDialog()
          PlayerRepository.updatePlayerContactInfo(this.playerID, false, false, false, '')
        }

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

    setTeamCounter() {
      db.ref(`game/${this.gameID}`).on("value", (snapshot) => {
        this.cleanCount = snapshot.val().cleanCount
        this.infectedCount = snapshot.val().infectedCount
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
      }
      
      this.canMove = true
      GameRepository.startGame(this.gameID, this.players.length - sampleSize, sampleSize)
    },

    setStartingPos() {
      const square = GameHelper.getStartingSquare(this.players)
      this.row = square.row
      this.col = square.col
    },

    waitTwoSeconds() {
      if (!this.game.gameStarted) { return }
      this.hasMovedAfterContact = true //used in forced move
      this.timer = 0 // TODO: revert to 2
      this.canMove = false
      let time = setInterval(() => {
        //this.timer--
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
