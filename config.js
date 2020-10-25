import firebase from 'firebase'

require("@firebase/firestore")
var firebaseConfig = {
    apiKey: "AIzaSyC5K-R1aL-xkbQiTcJC0Vj7Pdmy0SPrkmo",
    authDomain: "virtuallibrary-f09d2.firebaseapp.com",
    databaseURL: "https://virtuallibrary-f09d2.firebaseio.com",
    projectId: "virtuallibrary-f09d2",
    storageBucket: "virtuallibrary-f09d2.appspot.com",
    messagingSenderId: "644114722527",
    appId: "1:644114722527:web:1ed6ca7b7b1c601e0b436a",
    measurementId: "G-E7E94TWYLE"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  export default firebase.firestore()