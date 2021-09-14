<template>
  <div id="entryPage" v-if="currentPage === 'entry'">
    <h1>Welcome to Hatdog Us!</h1> 
    <button @click="showRoomCodeForm(true)">Enter Room</button>
    <button @click="showRoomCodeForm(false)">Create Room</button>
  </div>
  <div id="roomCodeForm" v-else-if="currentPage === 'roomCodeForm'">
    <h1 v-if="existingRoom">Enter room code:</h1> 
    <input type="text" v-if="existingRoom" v-model="roomCode" />
    <p class="err-message" v-if="!firstTime && !doesGameExist">This game does not exist.</p>
    <p class="err-message" v-if="isGameFull">This game is full.</p>
    <p class="err-message" v-if="isGameStarted">This game has already started.</p>
    
    <h1>Enter name:</h1> 
    <input type="text" v-model="name" />

    <button :disabled="!canEnterGame" @click="enterRoom">Play</button>
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
      existingRoom: true,
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
      return this.playersInRoom.length === 10
    },
    isGameStarted() {
      return this.desiredGame ? this.desiredGame.gameStarted : false
    },
    canEnterGame() {
      return (this.doesGameExist && !(this.isGameStarted || this.isGameFull)) || !this.existingRoom
    }
  },
  methods: {
    showRoomCodeForm(existingRoom) {
      this.currentPage = 'roomCodeForm'
      this.existingRoom = existingRoom
    },
    enterRoom() {
      if (this.existingRoom) {
        this.firstTime = false
        if (!this.doesGameExist) {
          return
        }
        this.$emit('enterGame', { 
          roomCode: this.roomCode, 
          isNewRoom: false,
          name: this.name
        })
      } else {
        const existingCodes = this.games.map(val => val['.key'])
        this.$emit('enterGame', { 
          roomCode: Helper.getRoomCode(existingCodes),
          isNewRoom: true,
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
