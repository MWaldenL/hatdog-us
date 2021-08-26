import firebase from "firebase"
import "firebase/app"
import "firebase/database"
import "firebase/auth"

const db = firebase.initializeApp({
  apiKey: "AIzaSyCSiw499h5HcW2sTGvbVfMDNMQmibrnL3M",
  authDomain: "hatdog-9ef9e.firebaseapp.com",
  projectId: "hatdog-9ef9e",
  databaseURL: "https://hatdog-9ef9e-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "hatdog-9ef9e.appspot.com",
  messagingSenderId: "845117230098",
  appId: "1:845117230098:web:2686edbafbbf18389cdccb"
}).database()

const playersRef = db.ref(`players`)
export { db, playersRef }