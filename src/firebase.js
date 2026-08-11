import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBKfymus_DEEzkaEbC_uEiNI_DhwU_NFVI",
  authDomain: "math-formula-app-eb035.firebaseapp.com",
  projectId: "math-formula-app-eb035",
  storageBucket: "math-formula-app-eb035.firebasestorage.app",
  messagingSenderId: "54332465730",
  appId: "1:54332465730:web:907153619a790605d283db"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)
export const logOut = () => signOut(auth)