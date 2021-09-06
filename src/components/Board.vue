<template>
<div id="table">  
  <table>
    <tr v-for="(row, rowInd) in board" :key="rowInd">
      <Square v-for="(col, colInd) in row" :key="colInd" 
        :hasPiece="hasPiece(col)" />
    </tr>
  </table>
</div>
</template>

<script>
import Square from './Square'
import PlayerRepository from '@/model/repository/playerRepository'
import BoardHelper from '@/helpers/BoardHelper'
import { playersRef } from '@/firebase'

export default {
  created() {
    window.addEventListener('keydown', e => this.move(e.key))
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
  },
  components: {
    Square
  },
  props: {
    playerID: String,
    startRow: Number,
    startCol: Number
  },
  methods: {
    hasPiece(square) {
      return square.getPlayerCount() > 0
    },
    
    move(direction) {
      const newSquare = BoardHelper.move(this.playerID, direction, this.board, this.row, this.col)
      this.board[this.row][this.col] = newSquare
      this.row = newSquare.row
      this.col = newSquare.col
      this.updatePos(newSquare)
    },

    updatePos(newSquare) {
      console.log(newSquare)
      PlayerRepository.updatePlayer(this.playerID, 'square', {
        'row': this.row,
        'col': this.col,
        'currentPlayers': newSquare.currentPlayers
      })
    },

    showPlayers() {
      this.board = BoardHelper.getBoardWithPlayers(this.playerID, this.players, this.row, this.col)
    }
  }
}
</script>
