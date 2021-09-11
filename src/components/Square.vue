<template>
<td class="square" :class="{ light: !isWall, dark: isWall }">
  <div id="checker-black" :class="playerPiece(dir, num)" v-show="hasPiece" />
</td>
</template>

<script>
export default {
  props: {
    hasPiece: Boolean,
    isWall: Boolean,
    dir: String,
    num: Number,
  },

  methods: {
    playerPiece(dir, num) {
      let playerClass = `p${num}-${dir}`
      return {
        'player': true,
        [playerClass]: true,
      }
    }
  }
}
</script>

<style src="@/styles/square.css" />
