<template>
  <div id="home">
    <Board /> 
  </div>
</template>

<script>
import { usersRef } from "@/firebase"
import Board from './Board'
export default {
  components: {
    Board
  },
  created() {
    this.readData()
  },
  data() {
    return {
      name: "",
      users: []
    }
  },
  firebase: {
    users: usersRef
  },
  methods: {
    readData() {
      usersRef.on('value', (snapshot) => {
        const data = snapshot.val();
        this.name = data["user1"].name
      });
    }
  },
}
</script>
<style>
#home {
  display: flex;
  justify-content: center;
  align-content: center
}
</style>
