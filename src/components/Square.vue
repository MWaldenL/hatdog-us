<template>
<td class="square light">
  <div id="checker-black" class="chip black-chip" v-show="hasPiece"> 
  </div>
</td>
</template>

<script>
export default {
  props: {
    hasPiece: Boolean,
    row: Number,
    col: Number
  },
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
