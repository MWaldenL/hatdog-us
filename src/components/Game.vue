<template>
  <div id="entryForm" v-if="!entered">
    <h1>Enter Name:</h1> 
    <input type="text" @keyup.enter="enterGame" v-model="name" />
    <button :disabled="lobbyIsFull" @click="enterGame">Play</button>
  </div>
  <div id="home" v-else>
    <div id="playerList">
      <h1>Team Count</h1>
      <p>Clean: {{cleanCount}}</p>
      <p>Infected: {{infectedCount}}</p>
      <h1>Players ({{players.length}}):</h1> 
      <ul v-for="p in players" :key="p.id">
        <li v-if="p.online">{{ p.name }}</li>
      </ul>
    </div>
    <Board 
      :playerID="playerID"
      :startRow="row" 
      :startCol="col"
      :canMove="canMove"
      @playerMoved="waitTwoSeconds"
      ref="boardRef"/>
    <div id="timer">
      <h1>Move in: {{ timer }}</h1>
    </div>
    <div v-if="player && game && player.host && !game.gameStarted">
      <div>You are the host.</div>
      <div><button @click="startGame" :disabled="!minPlayersReached">Start Game</button></div>
    </div>
    <Dialog :isOpen="dialogOpen" :timer="dialogTimer" :message="dialogMessage" @contact="showDialog"/>
    <!-- TODO: FIX UI -->
    <div v-if="game && game.gameStarted">
      Game has started.
      <div v-if="player && player.infected">
        You are infected.
      </div>
      <div v-else>
        You are clean.
      </div>
      <div v-if="forceMoveTimer != 0">
        You will be forcefully moved in {{forceMoveTimer}}
      </div>
    </div>

  </div>
</template>

<script>
import { db, playersRef, gameRef } from "@/firebase"
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
      name: '',
      playerID: '',
      player: null,
      players: [],
      game: null,
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
      infectedCount: 0
    }
  },
  firebase: {
    players: playersRef,
    game: gameRef
  },
  components: {
    Board,
    Dialog
  },
  computed: {
    entered() {
      return this.playerID.length > 0
    },

    hostExists() {
      for (let player of this.players)
        if (player.host)
          return true
      return false
    },

    minPlayersReached() {
      return this.players.length >= 4 // TODO: change to 4 (minimum)
    },

    lobbyIsFull() {
      return this.players.length == 10 // TODO: change to 10 (max)
    }
  },

  methods: {
    enterGame() {
      this.playerID = Date.now().toString()
      this.setStartingPos()

      PlayerRepository.addPlayer(new Player({
        id: this.playerID,
        gameID: 'sample123',
        name: this.name,
        square: new Square(this.row, this.col),
        online: true,
        host: !this.hostExists
      }))
      PlayerRepository.observeOnlineStatus(this.playerID)
      GameRepository.initGame()

      db.ref(`players/${this.playerID}`).on("value", (snapshot) => {
        this.player = snapshot.val()

        // Check if player is currently in contact with another player
        if (this.player.contactInfo.inContact) {
          this.showDialog()
          PlayerRepository.updatePlayerContactInfo(this.playerID, false, false, false, '')
        }

      })

      gameRef.on("value", (snapshot) => {
        this.cleanCount = snapshot.val().cleanCount
        this.infectedCount = snapshot.val().infectedCount
      })
    },

    startGame() {
      this.canMove = true
      
      // randomly select players to set as infected
      let sampleSize = 0
      if (this.players.length >= 4 && this.players.length <= 6)
        sampleSize = 2
      else if (this.players.length >= 7 && this.players.length <= 10)
        sampleSize = 3
      let randomPlayers = _.sample(this.players, sampleSize)
      for (let p of randomPlayers)
        PlayerRepository.updatePlayer(p.id, "infected", true)
      GameRepository.startGame(this.players.length - sampleSize, sampleSize)
    },

    setStartingPos() {
      const square = GameHelper.getStartingSquare(this.players)
      this.row = square.row
      this.col = square.col
    },

    waitTwoSeconds() {
      if (this.game.gameStarted) {
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
      }
    },

    showDialog() {
      if (this.game.gameStarted) {
        this.dialogMessage = GameHelper.generateDialogMessage(this.player)
        this.dialogOpen = true
        this.canMove = false
        this.dialogTimer = 5
        this.timer = 5
        let time = setInterval(() => {
          this.dialogTimer--
          this.timer--
          if (this.dialogTimer === 0) {
            clearInterval(time)
            this.dialogOpen = false
            this.waitForcedMove()
          }
        }, 1000)
      }
    },

    waitForcedMove() {
      this.hasMovedAfterContact = false
      this.canMove = true

      if (this.game.gameStarted) {
        this.forceMoveTimer = this.player.contactInfo.withAlly ? 2 : 3
        
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
}
</script>
<style>
#home {
  display: flex;
  justify-content: center;
  align-content: center
}
</style>
