import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

firebase.initializeApp({
  apiKey: "AIzaSyCSiw499h5HcW2sTGvbVfMDNMQmibrnL3M",
  authDomain: "hatdog-9ef9e.firebaseapp.com",
  projectId: "hatdog-9ef9e",
  storageBucket: "hatdog-9ef9e.appspot.com",
  messagingSenderId: "845117230098",
  appId: "1:845117230098:web:2686edbafbbf18389cdccb"
})

const db = firebase.firestore()
const auth = firebase.auth()
export { db, auth }