<template>
<td class="square" :class="{ light: !isWall, dark: isWall }">
  <div id="checker-black" :class="playerPiece(dir)" v-show="hasPiece" />
</td>
</template>

<script>
export default {
  props: {
    hasPiece: Boolean,
    row: Number,
    col: Number,
    isWall: Boolean
  },

  methods: {
    playerPiece(dir) {
      let up, down, left, right
      up = down = left = right = false

      if (dir === 'up')
        up = true
      else if (dir === 'down')
        down = true
      else if (dir === 'left')
        left = true
      else if (dir === 'right')
        right = true

      return {
        'player': true,
        'p1-up': up,
        'p1-down': down,
        'p1-left': left,
        'p1-right': right,
      }
    }
  }
}
</script>

<style src="@/styles/square.css" />
