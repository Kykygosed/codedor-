// ============================================
//  KERDORÉ — Configuration Firebase
// ============================================

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyWu4TI4PIRXfeb7yqt0WIGClgu10IjkM",
  authDomain: "kylita-f2923.firebaseapp.com",
  databaseURL: "https://kylita-f2923-default-rtdb.firebaseio.com",
  projectId: "kylita-f2923",
  storageBucket: "kylita-f2923.firebasestorage.app",
  messagingSenderId: "431823530994",
  appId: "1:431823530994:web:88a07e633751686e5ad96b",
  measurementId: "G-F4LLNWQJ16"
};

firebase.initializeApp(firebaseConfig);
const db   = firebase.database();
const auth = firebase.auth();