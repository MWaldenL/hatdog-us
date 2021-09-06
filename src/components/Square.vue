<template>
<td class="square light">
  <div id="checker-black" class="chip black-chip" v-show="hasPiece" />
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

<style src="@/styles/square.css" />
