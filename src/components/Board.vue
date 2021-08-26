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
import { db, usersRef } from '@/firebase'
export default {
  created() {
    window.addEventListener('keydown', e => this.move(e.key))
    this.row = this.startRow
    this.col = this.startCol
    usersRef.on('value', () => {
      this.showPlayers()
    })
  },
  data() {
    return {
      board: new Array(15).fill(null).map(() => Array(15)),
      users: [],
      row: -1,
      col: -1
    }
  },
  firebase: {
    users: usersRef,
  },
  components: {
    Square
  },
  props: {
    userID: String,
    startRow: Number,
    startCol: Number
  },
  methods: {
    hasPiece(square) {
      return square == 'o'
    },
    updatePos() {
      db.ref(`users/${this.userID}/`).update({
        'square': {
          'row': this.row,
          'col': this.col
        }
      })
    },
    move(direction) {
      let boardCopy = JSON.parse(JSON.stringify(this.board))
      boardCopy[this.row][this.col] = ''
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
      boardCopy[this.row][this.col] = 'o'
      this.board = boardCopy
    },
    showPlayers() {
      let newBoard = new Array(15).fill(null).map(() => Array(15))
      newBoard[this.row][this.col] = 'o' // this player
      for (let user of this.users) { // other players
        let {row, col} = user.square
        newBoard[row][col] = 'o'
      }
      this.board = newBoard
    }
  }
}
</script>
