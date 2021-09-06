<template>
  <div id="entryForm" v-if="!entered">
    <h1>Enter Name:</h1> 
    <input type="text" @keyup.enter="enterGame" v-model="name" />
    <button @click="enterGame">Play</button>
  </div>
  <div id="home" v-else>
    <div id="playerList">
      <h1>players:</h1> 
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
  </div>
</template>

<script>
import { playersRef } from "@/firebase"
import Player from '@/model/dataobjects/Player'
import Square from '@/model/dataobjects/Square'
import PlayerRepository from '@/model/repository/playerRepository'
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
    players: playersRef
  },
  components: {
    Board
  },
  computed: {
    entered() {
      return this.playerID.length > 0
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
        online: true
      }))
      PlayerRepository.observeOnlineStatus(this.playerID)
    },

    setStartingPos() {
      const square = GameHelper.getStartingSquare(this.players)
      this.row = square.row
      this.col = square.col
    },

    waitTwoSeconds() {
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
}
</script>
<style>
#home {
  display: flex;
  justify-content: center;
  align-content: center
}
</style>
