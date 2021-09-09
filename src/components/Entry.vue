<template>
  <div id="entryPage" v-if="currentPage === 'entry'">
    <h1>Welcome to Hatdog Us!</h1> 
    <button @click="showRoomCodeForm">Enter Room</button>
    <button @click="enterGame">Create Room</button>
  </div>
  <div id="roomCodeForm" v-else-if="currentPage === 'roomCodeForm'">
    <h1>Enter room code:</h1> 
    <input type="text" @keyup.enter="enterGame" v-model="roomCode" />
    <p class="err-message" v-if="!firstTime && !doesGameExist">This game does not exist.</p>
    <p class="err-message" v-if="isGameFull">This game is full.</p>
    <p class="err-message" v-if="isGameStarted">This game has already started.</p>
    
    <h1>Enter name:</h1> 
    <input type="text" v-model="name" />

    <button :disabled="!canEnterGame" @click="enterGame">Play</button>
    <button @click="back">Back</button>
  </div>
</template>

<script>
import Helper from '@/helpers/helper'
import { playersRef, gameRef } from "@/firebase"

export default {
  data() {
    return {
      firstTime: true,
      currentPage: 'entry',
      roomCode: '',
      name: Helper.getRandomName(),
      players: [],
      games: []
    }
  },
  firebase: {
    players: playersRef,
    games: gameRef
  },  
  computed: {
    playersInRoom() {
      return this.players.filter(player => player.gameID === this.roomCode)
    },
    desiredGame() {
      return this.doesGameExist ? 
        this.games.filter(game => game['.key'] === this.roomCode)[0] :
        null
    },
    doesGameExist() {
      return this.roomCode.length > 0 &&
        this.games.filter(game => game['.key'] === this.roomCode).length > 0
    },
    isGameFull() {
      return this.playersInRoom.length === 3
    },
    isGameStarted() {
      return this.desiredGame ? this.desiredGame.gameStarted : false
    },
    canEnterGame() {
      return this.doesGameExist && !(this.isGameStarted || this.isGameFull)
    }
  },
  methods: {
    showRoomCodeForm() {
      this.currentPage = 'roomCodeForm'
    },
    enterGame() {
      this.firstTime = false
      if (!this.doesGameExist) {
        return
      }
      if (this.roomCode === '') {
        this.$emit('enterGame', { 
          roomCode: Helper.getRoomCode(),
          isNewRoom: true,
          name: this.name
        })
      } else {
        this.$emit('enterGame', { 
          roomCode: this.roomCode, 
          isNewRoom: false,
          name: this.name
        })
      }
    },
    back() {
      this.currentPage = 'entry'
    }
  }
}
</script>
