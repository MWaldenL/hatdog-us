<template>
  <div v-if="!entered">
    <h1>Enter Name:</h1> 
    <input type="text" v-model="name" />
    <button @click="enterNew">Play</button>
  </div>
  <div id="home" v-else>
    <div>
      <h1>Users:</h1> 
      <ul v-for="user in users" :key="user.id">
        <li v-if="user.online">{{ user.name }}</li>
      </ul>
    </div>
    <Board 
      :userID="userID"
      :startRow="row" 
      :startCol="col" />
  </div>
</template>

<script>
import { db, usersRef } from "@/firebase"
import Board from './Board'
export default {
  async created() {
    this.setOnline()
  },
  data() {
    return {
      name: '',
      userID: '',
      users: [],
      row: -1,
      col: -1
    }
  },
  firebase: {
    users: usersRef
  },
  components: {
    Board
  },
  computed: {
    entered() {
      return this.userID.length > 0
    }
  },
  methods: {
    setOnline() {
      if (this.userID === '') { 
        console.log('No user')
        return
      } 
      const connRef = db.ref('.info/connected')
      const statusRef = db.ref(`users/${this.userID}/online`)
      connRef.on("value", async (snap) => {
        if (snap.val()) {
          await statusRef.onDisconnect().remove()
          await statusRef.set(true)
          console.log("connected");
        } else {
          statusRef.set(false)
          console.log('dc')
        }
      })
    },
    enterNew() {
      this.userID = Date.now().toString()
      do {
        this.row = this.getRandomInt(0, 15)
        this.col = this.getRandomInt(0, 15)
      } while (this.occupied(this.row, this.col))
      db.ref(`users/${this.userID}`).set({ // add a new player
        gameID: 'sample123',
        name: this.name,
        square: {'row': this.row, 'col': this.col},
        online: true
      })
    },
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
    },
    occupied(r, c) {
      for (let user of this.users) {
        let { row, col } = user.square
        if (row === r && col == c) {
          return true
        }
      }
      return false
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
