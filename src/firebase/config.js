// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBsm4JYHN2P5M9Jfn8elp-OQnMgRB0wQ-0",
  authDomain: "autocare-94e65.firebaseapp.com",
  projectId: "autocare-94e65",
  storageBucket: "autocare-94e65.appspot.com",
  messagingSenderId: "611516734843",
  appId: "1:611516734843:web:f0af73e123ac1753bdf1de",
  measurementId: "G-B5EZTQNJX6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
