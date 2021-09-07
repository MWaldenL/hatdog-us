import firebase from 'firebase'
import "firebase/app"
import "firebase/database"
import "firebase/auth"

// const db = firebase.initializeApp({
//   apiKey: "AIzaSyCSiw499h5HcW2sTGvbVfMDNMQmibrnL3M",
//   authDomain: "hatdog-9ef9e.firebaseapp.com",
//   projectId: "hatdog-9ef9e",
//   databaseURL: "https://hatdog-9ef9e-default-rtdb.asia-southeast1.firebasedatabase.app",
//   storageBucket: "hatdog-9ef9e.appspot.com",
//   messagingSenderId: "845117230098",
//   appId: "1:845117230098:web:2686edbafbbf18389cdccb"
// }).database()

// For mats' use
const db = firebase.initializeApp({
  apiKey: "AIzaSyAr9lLA4Mod9eqmMwRCheWjud133ZnjB6k",
  authDomain: "mats-hatdog-play.firebaseapp.com",
  projectId: "mats-hatdog-play",
  databaseURL: "https://mats-hatdog-play-default-rtdb.asia-southeast1.firebasedatabase.app/",
  storageBucket: "mats-hatdog-play.appspot.com",
  messagingSenderId: "848295525877",
  appId: "1:848295525877:web:d1745baf3cf32f376574bc"
}).database()

const playersRef = db.ref(`players`)
export { db, playersRef }