<template>
<div id="table">  
  <table>
    <tr v-for="(row, rowInd) in board" :key="rowInd">
      <Square v-for="(col, colInd) in row" :key="colInd" :hasPiece="hasPiece(col)" />
    </tr>
  </table>
</div>
</template>

<script>
import Square from './Square'
export default {
  created() {
    window.addEventListener('keydown', e => this.move(e.key))
  },
  mounted() {
    this.row = this.startRow
    this.col = this.startCol
    this.board[this.startRow][this.startCol] = 'o' 
  },
  data() {
    return {
      board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ],
      row: -1,
      col: -1
    }
  },
  components: {
    Square
  },
  props: {
    startRow: Number,
    startCol: Number
  },
  methods: {
    hasPiece(square) {
      return square == 'o'
    },
    move(direction) {
      let boardCopy = JSON.parse(JSON.stringify(this.board))
      boardCopy[this.row][this.col] = ''
      switch(direction) {
        case 'ArrowUp':
          this.row = Math.max(this.row-1, 0); break;
        case 'ArrowLeft':
          this.col = Math.max(this.col-1, 0); break;
        case 'ArrowDown':
          this.row = Math.min(this.row+1, this.board.length-1); break;
        case 'ArrowRight':
          this.col = Math.min(this.col+1, this.board.length-1); break;
      }
      boardCopy[this.row][this.col] = 'o'
      this.board = boardCopy
    },
  }
}
</script>


<style scoped>
.square {
  height: 80px;
  width: 80px;
  margin: 0;
  padding: 0;
}

.light {
  background-color: #ebecd0;
}

.chip {
  position: absolute;
  z-index: 2;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  opacity: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.black-chip {
  background: radial-gradient(50% 50% at 50% 50%, rgba(48, 48, 48, 0.74) 0%, #424242 100%);
  border: 10px solid #3A3A3A;
}

.king {
  height: 40px;
  width: 40px;
}
</style>
