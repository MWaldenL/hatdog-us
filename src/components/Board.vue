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
import { playersRef } from '@/firebase'
export default {
  created() {
    window.addEventListener('keydown', e => this.move(e.key))
    this.row = this.startRow
    this.col = this.startCol
    playersRef.on('value', () => {
      this.showPlayers()
    })
  },
  data() {
    return {
      board: Array.from(Array(15), () => Array(15).fill('')),
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
      return square == 'o'
    },
    updatePos() {
      PlayerRepository.updatePlayer(this.playerID, 'square', {
        'row': this.row,
        'col': this.col
      })
    },
    move(direction) {
      let newRow, newCol
      switch(direction) {
        case 'ArrowUp':
          newRow = Math.max(this.row-1, 0)
          if (this.board[newRow][this.col] === '') {
            this.row = newRow
            this.updatePos()
          }
          break;
        case 'ArrowLeft':
          newCol = Math.max(this.col-1, 0)
          if (this.board[this.row][newCol] === '') {
            this.col = newCol
            this.updatePos();
          }
          break;
        case 'ArrowDown':
          newRow = Math.min(this.row+1, this.board.length-1); 
          if (this.board[newRow][this.col] === '') {
            this.row = newRow
            this.updatePos();
          }
          break;
        case 'ArrowRight':
          newCol = Math.min(this.col+1, this.board.length-1);
          if (this.board[this.row][newCol] === '') {
            this.col = newCol
            this.updatePos();
          }
          break;
      }
    },
    showPlayers() {
      let newBoard = Array.from(Array(15), () => Array(15).fill(''))
      newBoard[this.row][this.col] = 'o' // this player
      for (let player of this.players) { // other players
        let {row, col} = player.square
        newBoard[row][col] = 'o'
      }
      this.board = newBoard
    }
  }
}
</script>
