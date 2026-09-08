import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBxLzMq3gzVWMtv_7vQYNNnPDy3WEI8_YI',
  authDomain: 'app-appart.firebaseapp.com',
  projectId: 'app-appart',
  storageBucket: 'app-appart.firebasestorage.app',
  messagingSenderId: '1020449647457',
  appId: '1:1020449647457:web:e0ea4442d89207d1177320'
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

export function connexion() {
  return signInAnonymously(auth)
}
