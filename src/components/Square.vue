<template>
<td class="square" :class="{ light: !isWall, dark: isWall }">
  <div id="checker-black" class="chip black-chip" v-show="hasPiece" />
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
}
</script>

<style src="@/styles/square.css" />
