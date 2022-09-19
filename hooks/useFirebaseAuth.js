import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"

import { useFirebase } from "./useFirebase"

export function useFirebaseAuth() {
  const { auth } = useFirebase()

  async function handleCreateAccount({ email, password }) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)

    return user
  }

  async function handleEmailLogin({ email, password }) {
    const { user } = await signInWithEmailAndPassword(auth, email, password)

    return user
  }

  async function handleGoogleLogin() {
    return
  }

  return { handleEmailLogin, handleCreateAccount, handleGoogleLogin }
}
