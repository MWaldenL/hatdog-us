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
      if (GameHelper.keys.includes(e.key))
        this.move(e.key)
    })
    this.row = this.startRow
    this.col = this.startCol
    playersRef.on('value', () => this.showPlayers())
  },
  data() {
    return {
      board: BoardHelper.initializeBoard(),
      players: [],
      row: -1,
      col: -1
    }
  },
  firebase: {
    players: playersRef,
    game: gameRef
  },
  components: {
    Square
  },
  props: {
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
      if (this.canMove && this.game.gameStarted) {
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
          alert("can't move")
        }
      }
    },

    showPlayers() {
      this.board = GameHelper.getBoardWithPlayers(this.playerID, this.players, this.row, this.col)
    },

    randomMove() {
        let direction = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
        let randInd, newSquare
        do {
          randInd = Math.floor(Math.random() * direction.length)
          newSquare = BoardHelper.move(this.playerID, direction[randInd], this.board, this.row, this.col)
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
