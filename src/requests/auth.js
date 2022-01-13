import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import { setDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export async function signUp(payload) {
  const { email, password, phone_number, company } = payload
  const auth = getAuth()
  await setPersistence(auth, browserLocalPersistence)
  const data = await createUserWithEmailAndPassword(auth, email, password)

  const userRef = doc(db, 'users', data.user.uid)
  await setDoc(userRef,{
    email,
    phone_number,
    role: 'user',
    company
  })
  const userSnap = await getDoc(userRef)

  return userSnap.data()
}

export async function logIn(credentials) {
  const { email, password } = credentials
  const auth = getAuth()
  await setPersistence(auth, browserLocalPersistence)
  const data = await signInWithEmailAndPassword(auth, email, password)
  const userRef = doc(db,'users', data.user.uid)
  const userSnap = await getDoc(userRef)

  return userSnap.data()
}

export async function logOut() {
  const auth = getAuth()

  return signOut(auth)
}

export async function isAuthenticated() {
  const auth = getAuth()

  return !!auth.currentUser
}

export async function getCurrentUser() {
  const auth = getAuth()

  if (!auth.currentUser) {
    return null
  }

  const userRef = doc(db, 'users', auth.currentUser.uid)
  const userSnap = await getDoc(userRef)

  return {
    id: userSnap.id,
    ...userSnap.data()
  }
  /* return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    }, reject)
  }) */
}

export async function updateUserInfo(payload) {
  const { email, phone_number, company } = payload
  const auth = getAuth()
  const userRef = doc(db, 'users', auth.currentUser.uid)

  await updateEmail(auth.currentUser, email)
  await updateDoc(userRef, {
    email,
    phone_number,
    company
  })
}

export async function updateUserPassword(newPassword) {
  const auth = getAuth()

  await updatePassword(auth.currentUser, newPassword)
}
