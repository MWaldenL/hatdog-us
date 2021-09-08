<template>
  <div id="entryForm" v-if="!entered">
    <h1>Enter Name:</h1> 
    <input type="text" @keyup.enter="enterGame" v-model="name" />
    <button @click="enterGame">Play</button>
  </div>
  <div id="home" v-else>
    <div id="playerList">
      <h1>Players ({{players.length}}):</h1> 
      <ul v-for="player in players" :key="player.id">
        <li v-if="player.online">{{ player.name }}</li>
      </ul>
    </div>
    <Board 
      :playerID="playerID"
      :startRow="row" 
      :startCol="col"
      :canMove="canMove"
      @playerMoved="waitTwoSeconds" />
    <div id="timer">
      <h1>Move in: {{ timer }}</h1>
    </div>
    <div v-if="playerIsHost && !game.gameStarted">
      <div>You are the host.</div>
      <div><button @click="startGame" :disabled="!minPlayersReached">Start Game</button></div>
    </div>

    <div v-if="game.gameStarted">
      Game has started
    </div>

  </div>
</template>

<script>
import { playersRef } from "@/firebase"
import { gameRef } from "@/firebase"
import Player from '@/model/dataobjects/Player'
import Square from '@/model/dataobjects/Square'
import PlayerRepository from '@/model/repository/playerRepository'
import GameRepository from '@/model/repository/gameRepository'
import GameHelper from '@/helpers/GameHelper'
import Board from './Board'

export default {
  data() {
    return {
      name: '',
      playerID: '',
      players: [],
      row: -1,
      col: -1,
      canMove: true,
      timer: 2
    }
  },
  firebase: {
    players: playersRef,
    game: gameRef
  },
  components: {
    Board
  },
  computed: {
    entered() {
      return this.playerID.length > 0
    },

    playerIsHost() {
      console.log("Player id = " + this.playerID)
      for (let player of this.players) {
        console.log("Checking if host " + player.id + ": " + player.host)
        if (player.id === this.playerID && player.host)
          return true
      }
      return false
    },

    hostExists() {
      for (let player of this.players) {
        if (player.host)
          return true
      }
      return false
    },

    minPlayersReached() {
      return this.players.length >= 1 // TODO: change to 4
    },
  },

  methods: {
    async enterGame() {
      this.playerID = Date.now().toString()
      this.setStartingPos()

      await PlayerRepository.addPlayer(new Player({
        id: this.playerID,
        gameID: 'sample123',
        name: this.name,
        square: new Square(this.row, this.col),
        online: true,
        host: !this.hostExists
      }))
      PlayerRepository.observeOnlineStatus(this.playerID)
      GameRepository.initGame()
    },

    startGame() {
      this.canMove = true
      GameRepository.startGame()
    },

    setStartingPos() {
      const square = GameHelper.getStartingSquare(this.players)
      this.row = square.row
      this.col = square.col
    },

    waitTwoSeconds() {
      if (this.game.gameStarted) {
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
    }
  },
}
</script>
<style>
#home {
  display: flex;
  justify-content: center;
  align-content: center
}
</style>
