<template>
  <div id="playerItem">
    <div :class="playerPiece('up', num)" />
    <h3 id="playerName">{{ name }}</h3>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    num: Number 
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
  justify-content: center;
  align-items: center;
}
#playerName {
  margin-left: 12px;
}
</style>