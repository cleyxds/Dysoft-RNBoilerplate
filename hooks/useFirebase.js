import { initializeApp } from "firebase/app"

import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

export function useFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyDGwitHkt4Txa2oCK2uIE2-xP6CTl1_QjA",
    authDomain: "boilerplate-rnapp.firebaseapp.com",
    projectId: "boilerplate-rnapp",
    storageBucket: "boilerplate-rnapp.appspot.com",
    messagingSenderId: "234995466720",
    appId: "1:234995466720:web:29b88b08b40511e0c96b85",
  }

  const app = initializeApp(firebaseConfig)

  const db = getFirestore(app)
  const storage = getStorage(app)

  return { app, db, storage }
}
