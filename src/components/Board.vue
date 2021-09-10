<template>
<div id="table">  
  <table>
    <tr v-for="(row, rowInd) in board" :key="rowInd">
      <Square v-for="(col, colInd) in row" :key="colInd" 
        :hasPiece="hasPiece(col)"
        :isWall="isWall(col)" />
    </tr>
  </table>
</div>
</template>

<script>
import Square from './Square'
import PlayerRepository from '@/model/repository/playerRepository'
import BoardHelper from '@/helpers/BoardHelper'
import GameHelper from '@/helpers/GameHelper'
import { playersRef, gameRef } from '@/firebase'

export default {
  created() {
    window.addEventListener('keydown', e => {
      if (GameHelper.moveKeys.includes(e.key))
        this.move(e.key)
    })
    this.row = this.startRow
    this.col = this.startCol
    playersRef.on('value', () => this.showPlayers())
  },
  data() {
    return {
      board: BoardHelper.initializeBoard(0),
      players: [],
      games: [],
      row: -1,
      col: -1
    }
  },
  firebase: {
    players: playersRef,
    games: gameRef
  },
  components: {
    Square
  },
  computed: {
    playersInGame() {
      return this.players.filter(player => player.gameID === this.gameID)
    },
    currentGame() {
      return this.games.filter(game => game['.key'] === this.gameID)[0]
    }
  },
  props: {
    gameID: String,
    playerID: String,
    startRow: Number,
    startCol: Number,
    canMove: Boolean
  },
  methods: {
    hasPiece(square) {
      return square.getPlayerCount() > 0
    },

    isWall(square) {
      return square.isWall
    },
    
    move(direction) {
      if (this.canMove && this.currentGame.gameStarted) {
        const newSquare = BoardHelper.move(this.playerID, direction, this.board, this.row, this.col)
        if (!newSquare.isWall) {
          this.row = newSquare.row
          this.col = newSquare.col
          PlayerRepository.updatePlayerSquare(this.playerID, this.row, this.col)

          if (BoardHelper.getPlayerCountInSquare(this.board, this.row, this.col) === 2) {
            let otherPlayerID = BoardHelper.getOtherPlayerInSquare(this.playerID, this.board, this.row, this.col)
            GameHelper.simulateContactInteraction(this.playerID, otherPlayerID)
          }
          else {
            this.$emit('playerMoved')
          }
        } 
        else {
          alert("You can't move past walls :p")
        }
      }
    },

    showPlayers() {
      this.board = GameHelper
        .getBoardWithPlayers(
          this.playerID, 
          this.playersInGame, 
          this.row, 
          this.col,
          this.currentGame.mapConfig)
    },

    randomMove() {
        let newSquare
        do {
          newSquare = BoardHelper.randomMove(
            this.playerID, 
            this.board, 
            this.row, 
            this.col)
        }
        while (newSquare.isWall)

        this.row = newSquare.row
        this.col = newSquare.col
        PlayerRepository.updatePlayerSquare(this.playerID, this.row, this.col)
        
        if (BoardHelper.getPlayerCountInSquare(this.board, this.row, this.col) === 2) {
          let otherPlayerID = BoardHelper.getOtherPlayerInSquare(this.playerID, this.board, this.row, this.col)
          GameHelper.simulateContactInteraction(this.playerID, otherPlayerID)
        }
        else {
          this.$emit('playerMoved')
        }
    }

  }
}

</script>
