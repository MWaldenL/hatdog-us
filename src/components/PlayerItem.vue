<template>
  <div id="playerItem">
    <div :class="playerPiece('up', num)" />
    <h3 style="margin-start: 0px" id="playerName">{{ name }} <span v-if="you">(You)</span></h3>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    num: Number,
    you: Boolean,
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

<style src="@/styles/square.css"></style>
<style scoped>
#playerItem {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
#playerName {
  margin-left: 12px;
}
</style>