import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCLZzrMVe8Tp1-AKMUOMWRUUBmf6IDD4NA",
  authDomain: "pivu-holdings-pty-ltd.firebaseapp.com",
  projectId: "pivu-holdings-pty-ltd",
  storageBucket: "pivu-holdings-pty-ltd.firebasestorage.app",
  messagingSenderId: "973431379610",
  appId: "1:973431379610:web:9b2366f1c57b200f943123",
  measurementId: "G-21PRG93JND"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const ADMIN_EMAILS = [
  "boitumelolindi@gmail.com",
  "xmanally@gmail.com",
  "pivuholdings@gmail.com"
];