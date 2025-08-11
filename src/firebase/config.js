// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 🔥 Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyBsm4JYHN2P5M9Jfn8elp-OQnMgRB0wQ-0",
  authDomain: "autocare-94e65.firebaseapp.com",
  projectId: "autocare-94e65",
  storageBucket: "autocare-94e65.appspot.com",
  messagingSenderId: "611516734843",
  appId: "1:611516734843:web:f0af73e123ac1753bdf1de",
  measurementId: "G-B5EZTQNJX6",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export auth and db
export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ Export Firestore
