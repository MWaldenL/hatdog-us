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
import { db, playersRef } from '@/firebase'
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
      board: new Array(15).fill(null).map(() => Array(15)),
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
      db.ref(`players/${this.playerID}/`).update({
        'square': {
          'row': this.row,
          'col': this.col
        }
      })
    },
    move(direction) {
      switch(direction) {
        case 'ArrowUp':
          this.row = Math.max(this.row-1, 0); 
          this.updatePos()
          break;
        case 'ArrowLeft':
          this.col = Math.max(this.col-1, 0); 
          this.updatePos();
          break;
        case 'ArrowDown':
          this.row = Math.min(this.row+1, this.board.length-1); 
          this.updatePos();
          break;
        case 'ArrowRight':
          this.col = Math.min(this.col+1, this.board.length-1);
          this.updatePos();
          break;
      }
    },
    showPlayers() {
      let newBoard = new Array(15).fill(null).map(() => Array(15))
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
